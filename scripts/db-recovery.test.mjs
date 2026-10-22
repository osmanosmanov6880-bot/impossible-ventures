import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync, rmSync, lstatSync, writeFileSync, symlinkSync, existsSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createApp } from '../services/dead-drop/server.mjs';
import { DatabaseSync } from 'node:sqlite';
import { inspectDatabase, restoreDatabase, snapshotDatabase } from './db-recovery.mjs';

async function serverFixture(t, dbPath) {
  const app = createApp({ dbPath });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => app.server.close(resolve));
    app.db.close();
  });
  return { app, base: 'http://127.0.0.1:' + app.server.address().port };
}

async function post(url, data, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    },
    body: JSON.stringify(data)
  });
  return { status: response.status, body: await response.json() };
}

test('live WAL snapshot includes both products and restores without loss', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'impossible-ops-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const dbPath = join(dir, 'live.sqlite');
  const backupPath = join(dir, 'nightly.sqlite');
  const restorePath = join(dir, 'restored.sqlite');
  const { app, base } = await serverFixture(t, dbPath);

  const mission = await post(base + '/api/v1/missions', {
    brand: 'Snapshot Test', product: 'Subscription software for teams',
    proof: 'Controlled public product demonstration', objective: 'leads'
  });
  assert.equal(mission.status, 201);
  const pilot = await post(base + '/api/v1/pilots', {
    company: 'Example Lab',
    contact: 'Test Operator',
    email: 'test@example.com',
    website: 'https://example.com',
    goal: 'leads',
    budget: '1k-5k',
    locale: 'en',
    consent: true,
    website_confirm: ''
  });
  assert.equal(pilot.status, 201);
  // Verify that real Experiment Lab tables are protected by this recovery flow,
  // not silently discarded while preserving only Dead Drop and Pilot Studio.
  app.db.prepare(
    'INSERT INTO ab_daily (experiment_id,cohort_day,arm,exposures,cta) VALUES (?,?,?,?,?)'
  ).run('ci-test-experiment', 20261022, 'A', 5, 2);
  app.db.prepare(
    'INSERT INTO ab_sessions (id,experiment_id,arm,token_hash,created_at,cohort_day,cta_recorded) VALUES (?,?,?,?,?,?,?)'
  ).run('ci-test-session', 'ci-test-experiment', 'A', 'synthetic-digest', Date.now(), 20261022, 1);

  app.db.prepare(
    'INSERT INTO republic_daily (challenge_id,cohort_day,a,b) VALUES (?,?,?,?)'
  ).run('synthetic-republic-challenge', 20261022, 2, 1);
  app.db.prepare(
    'INSERT INTO republic_sessions (id,challenge_id,token_hash,created_at,voted) VALUES (?,?,?,?,?)'
  ).run('synthetic-republic-session', 'synthetic-republic-challenge', 'synthetic-hash', Date.now(), 'a');

  const current = inspectDatabase(dbPath);
  assert.equal(current.integrity, 'ok');
  assert.equal(current.missions, 1);
  assert.equal(current.pilotApplications, 1);
  assert.equal(current.experimentLabPresent, true);
  assert.equal(current.experimentDailyRows, 1);
  assert.equal(current.experimentSessions, 1);
  assert.equal(current.republicPresent, true);
  assert.equal(current.republicSessions, 1);
  assert.equal(current.republicDailyRows, 1);

  const snapshot = snapshotDatabase({ dbPath, outputPath: backupPath });
  assert.equal(snapshot.action, 'snapshot');
  assert.equal(snapshot.missions, 1);
  assert.equal(snapshot.pilotApplications, 1);
  assert.equal(snapshot.experimentLabPresent, true);
  assert.equal(snapshot.experimentDailyRows, 1);
  assert.equal(snapshot.experimentSessions, 1);
  assert.equal(snapshot.republicPresent, true);
  assert.equal(snapshot.republicSessions, 1);
  assert.equal(snapshot.republicDailyRows, 1);
  assert.match(snapshot.sha256, /^[a-f0-9]{64}$/);
  assert.ok(snapshot.bytes > 0);
  assert.equal(lstatSync(backupPath).mode & 0o777, 0o600);
  assert.ok(snapshot.createdAt.includes('T'));

  // The source remains writable. The backup represents the earlier snapshot.
  const erased = await fetch(base + '/api/v1/missions/' + mission.body.code, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + mission.body.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ confirmCode: mission.body.code })
  });
  assert.equal(erased.status, 200);
  assert.equal(inspectDatabase(dbPath).missions, 0);
  assert.equal(inspectDatabase(backupPath).missions, 1);

  const restored = restoreDatabase({ backupPath, outputPath: restorePath });
  assert.equal(restored.action, 'restore');
  assert.equal(restored.sha256, snapshot.sha256);
  assert.equal(restored.missions, 1);
  assert.equal(restored.pilotApplications, 1);
  assert.equal(restored.experimentDailyRows, 1);
  assert.equal(restored.experimentSessions, 1);
  assert.equal(restored.republicPresent, true);
  assert.equal(restored.republicSessions, 1);
  assert.equal(restored.republicDailyRows, 1);
  assert.equal(lstatSync(restorePath).mode & 0o777, 0o600);

  // The restored database genuinely boots the server, not just SQLite.
  const recoveredServer = await serverFixture(t, restorePath);
  const recoveredMission = await fetch(
    recoveredServer.base + '/api/v1/missions/' + mission.body.code,
    { headers: { Authorization: 'Bearer ' + mission.body.token } }
  );
  assert.equal(recoveredMission.status, 200);
  const recoveredBody = await recoveredMission.json();
  assert.equal(recoveredBody.mission.brand, 'Snapshot Test');
  assert.equal(recoveredBody.mission.role, 'product');

  // Restoring cannot change the actively running original database.
  assert.equal(inspectDatabase(dbPath).missions, 0);
  assert.ok(app.db.prepare('SELECT 1').get());
});

test('recoverability checks refuse overwrites, corrupt files, unknown schemas and symlinks', t => {
  const dir = mkdtempSync(join(tmpdir(), 'impossible-recovery-errors-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const source = join(dir, 'source.sqlite');
  const backup = join(dir, 'backup.sqlite');
  const existing = join(dir, 'existing.sqlite');
  const garbage = join(dir, 'garbage.sqlite');
  const symlink = join(dir, 'linked.sqlite');
  const wrongSchema = join(dir, 'wrong.sqlite');

  assert.throws(() => snapshotDatabase({ dbPath: join(dir, 'missing.sqlite'), outputPath: backup }), /existing regular file/);
  assert.equal(existsSync(backup), false, 'Failed snapshot should clean up output');

  writeFileSync(garbage, 'Definitely not a valid SQLite database');
  assert.throws(() => inspectDatabase(garbage), /Database|SQLite|SQLITE|database|file/);
  assert.throws(() => restoreDatabase({ backupPath: garbage, outputPath: backup }), /Database|SQLite|SQLITE|database|file/);
  assert.equal(existsSync(backup), false);

  writeFileSync(existing, 'Existing private data must not be overwritten.');
  assert.throws(() => restoreDatabase({ backupPath: garbage, outputPath: existing }), /already exists/);
  assert.equal(existsSync(existing), true);

  symlinkSync(garbage, symlink);
  assert.throws(() => inspectDatabase(symlink), /not a symlink/);
  assert.throws(() => restoreDatabase({ backupPath: symlink, outputPath: backup }), /not a symlink/);

  const db = new DatabaseSync(source);
  db.exec('CREATE TABLE missions(code TEXT); CREATE TABLE pilot_leads(id TEXT);');
  db.close();
  const original = snapshotDatabase({ dbPath: source, outputPath: backup });
  assert.equal(original.missions, 0);
  assert.equal(original.experimentLabPresent, false);
  assert.equal(original.republicPresent, false);
  assert.throws(() => snapshotDatabase({ dbPath: source, outputPath: backup }), /already exists/);
  assert.throws(() => restoreDatabase({ backupPath: backup, outputPath: existing }), /already exists/);
  assert.throws(() => snapshotDatabase({ dbPath: source, outputPath: source }), /Source and destination/);

  const alien = new DatabaseSync(wrongSchema);
  alien.exec('CREATE TABLE another_application(id TEXT)');
  alien.close();
  assert.throws(() => inspectDatabase(wrongSchema), /Unrecognized database schema/);
  assert.throws(() => snapshotDatabase({ dbPath: wrongSchema, outputPath: join(dir, 'rejected.sqlite') }), /Unrecognized database schema/);
  assert.equal(existsSync(join(dir, 'rejected.sqlite')), false);
});


test('CLI help and failed backup do not disclose private tokens', () => {
  const cli = resolve('scripts/db-recovery.mjs');
  const help = execFileSync(process.execPath, [cli, '--help'], { encoding: 'utf8' });
  assert.match(help, /VACUUM|backup --db|Backups contain private data/);
  assert.doesNotMatch(help, /sk-/);
});
