/**
 * Offline/maintenance SQLite recovery utilities for Impossible Ventures.
 *
 * - snapshotDatabase: VACUUM INTO provides a consistent, standalone snapshot
 *   even when the source database uses WAL and the app is running.
 * - inspectDatabase: reports only integrity and table counts (never PII).
 * - restoreDatabase: restores only into a NEW database path. Never overwrites
 *   an existing live database; shut down the service before switching paths.
 *
 * WARNING: Backups contain personal pilot contacts, tokens hashes and mission
 * data. Keep them on encrypted, access-restricted storage with a deletion policy.
 * These functions are intentionally NOT exposed through the HTTP API.
 */
import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import {
  closeSync, constants, copyFileSync, existsSync, lstatSync, openSync,
  readSync, chmodSync, statSync, unlinkSync
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_TABLES = ['missions', 'pilot_leads'];

function absolutePath(path, label) {
  if (typeof path !== 'string' || path.trim().length < 2) {
    throw new Error(label + ' is required');
  }
  return resolve(path);
}

function ensureRegularFile(path, label) {
  const stat = lstatSync(path, { throwIfNoEntry: false });
  if (!stat || !stat.isFile() || stat.isSymbolicLink()) {
    throw new Error(label + ' must be an existing regular file, not a symlink');
  }
}

function ensureFreshTarget(target, source) {
  if (target === source) throw new Error('Source and destination must differ');
  if (existsSync(target) || existsSync(target + '-wal') || existsSync(target + '-shm')) {
    throw new Error('Destination already exists. Refusing to overwrite it');
  }
}

function integritySummary(db) {
  const integrity = db.prepare('PRAGMA quick_check').get();
  if (integrity?.quick_check !== 'ok') throw new Error('Database failed SQLite quick_check');
  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('missions','pilot_leads')"
  ).all();
  const found = new Set(tables.map(row => row.name));
  for (const required of REQUIRED_TABLES) {
    if (!found.has(required)) throw new Error('Unrecognized database schema: missing ' + required);
  }
  return {
    integrity: 'ok',
    missions: Number(db.prepare('SELECT COUNT(*) AS n FROM missions').get().n),
    pilotApplications: Number(db.prepare('SELECT COUNT(*) AS n FROM pilot_leads').get().n)
  };
}

function withReadonlyDatabase(file, callback) {
  ensureRegularFile(file, 'Database');
  const database = new DatabaseSync(file, { readOnly: true });
  try {
    return callback(database);
  } finally {
    database.close();
  }
}

export function inspectDatabase(dbPath) {
  const source = absolutePath(dbPath, 'Database path');
  const summary = withReadonlyDatabase(source, integritySummary);
  return { ...summary, bytes: statSync(source).size };
}

function hashFile(file) {
  const hash = createHash('sha256');
  const fd = openSync(file, 'r');
  const block = Buffer.allocUnsafe(1024 * 1024);
  try {
    let read;
    while ((read = readSync(fd, block, 0, block.length, null)) > 0) {
      hash.update(block.subarray(0, read));
    }
  } finally {
    closeSync(fd);
  }
  return hash.digest('hex');
}

export function snapshotDatabase({ dbPath, outputPath, now = Date.now } = {}) {
  const source = absolutePath(dbPath, 'Database path');
  const destination = absolutePath(outputPath, 'Backup destination');
  ensureFreshTarget(destination, source);
  // Create an empty restricted target exclusively before VACUUM INTO.
  // SQLite accepts a pre-created zero-byte destination file.
  const handle = openSync(destination, 'wx', 0o600);
  closeSync(handle);
  try {
    withReadonlyDatabase(source, db => {
      integritySummary(db);
      db.prepare('VACUUM INTO ?').run(destination);
    });
    chmodSync(destination, 0o600);
    const summary = inspectDatabase(destination);
    return {
      action: 'snapshot',
      createdAt: new Date(now()).toISOString(),
      file: destination,
      sha256: hashFile(destination),
      ...summary
    };
  } catch (error) {
    try { unlinkSync(destination); } catch {}
    throw error;
  }
}

export function restoreDatabase({ backupPath, outputPath, now = Date.now } = {}) {
  const source = absolutePath(backupPath, 'Backup path');
  const destination = absolutePath(outputPath, 'Restore destination');
  ensureRegularFile(source, 'Backup');
  ensureFreshTarget(destination, source);
  // Refuse unknown or corrupt input *before* creating output.
  const original = inspectDatabase(source);
  copyFileSync(source, destination, constants.COPYFILE_EXCL);
  try {
    chmodSync(destination, 0o600);
    const restored = inspectDatabase(destination);
    if (restored.missions !== original.missions ||
        restored.pilotApplications !== original.pilotApplications) {
      throw new Error('Restored database row counts do not match the backup');
    }
    if (hashFile(destination) !== hashFile(source)) {
      throw new Error('Restored database checksum differs from backup');
    }
    return {
      action: 'restore',
      createdAt: new Date(now()).toISOString(),
      file: destination,
      sha256: hashFile(destination),
      ...restored
    };
  } catch (error) {
    try { unlinkSync(destination); } catch {}
    throw error;
  }
}

function flagValue(args, key) {
  const index = args.indexOf('--' + key);
  if (index < 0 || index + 1 >= args.length || args[index + 1].startsWith('--')) {
    throw new Error('Missing --' + key);
  }
  return args[index + 1];
}

function usage() {
  return [
    'Usage:',
    '  node scripts/db-recovery.mjs inspect --db /data/missions.sqlite',
    '  node scripts/db-recovery.mjs backup --db /data/missions.sqlite --out /safe/backup.sqlite',
    '  node scripts/db-recovery.mjs restore --from /safe/backup.sqlite --out /new/missions.sqlite',
    '',
    'IMPORTANT: Backups contain private data. Never upload them to GitHub.',
    'Restore refuses to overwrite any existing database.',
    'Stop the server before switching DB_PATH to a restored database.'
  ].join('\n');
}

function runCli(args) {
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    process.stdout.write(usage() + '\n');
    return;
  }
  const action = args[0];
  let result;
  if (action === 'inspect') {
    result = { action, ...inspectDatabase(flagValue(args, 'db')) };
  } else if (action === 'backup') {
    result = snapshotDatabase({
      dbPath: flagValue(args, 'db'),
      outputPath: flagValue(args, 'out')
    });
  } else if (action === 'restore') {
    result = restoreDatabase({
      backupPath: flagValue(args, 'from'),
      outputPath: flagValue(args, 'out')
    });
  } else {
    throw new Error('Unknown operation: ' + action + '\n' + usage());
  }
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { runCli(process.argv.slice(2)); }
  catch (error) {
    // Avoid printing stack traces that might expose infrastructure internals.
    process.stderr.write('Database maintenance failed: ' + error.message + '\n');
    process.exitCode = 1;
  }
}
