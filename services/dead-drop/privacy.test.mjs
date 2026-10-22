import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './server.mjs';

const WEEK = 7 * 24 * 60 * 60 * 1000;
const brand = {
  brand: 'Aurora Studio',
  product: 'PRIVATE PRODUCT DETAIL: Aurora subscriptions',
  proof: 'PRIVATE EVIDENCE: audited sample records',
  objective: 'leads'
};
const audience = {
  audience: 'PRIVATE AUDIENCE DETAIL: independent consultants',
  friction: 'PRIVATE AUDIENCE FRICTION: too many fragmented tools',
  channel: 'landing'
};

async function start(t, options = {}) {
  const app = createApp({ dbPath: ':memory:', ...options });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + app.server.address().port;
  t.after(async () => {
    await new Promise(resolve => app.server.close(resolve));
    app.db.close();
  });
  return { base, app };
}
async function request(base, route, { method = 'GET', token, body } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(base + route, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body)
  });
  return { status: response.status, data: await response.json(), headers: response.headers };
}
async function createRoom(base, join = true) {
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: brand });
  assert.equal(host.status, 201);
  const route = '/api/v1/missions/' + host.data.code;
  const guest = join
    ? await request(base, route + '/join', { method: 'POST', body: audience })
    : null;
  if (guest) assert.equal(guest.status, 201);
  return { route, host, guest };
}

test('role-specific export requires valid authorization and never exports agent tokens', async t => {
  const { base } = await start(t);
  const { route, host, guest } = await createRoom(base);
  assert.equal((await request(base, route + '/export')).status, 401);
  assert.equal((await request(base, route + '/export', { token: 'wrong-token' })).status, 403);

  const product = await request(base, route + '/export', { token: host.data.token });
  const target = await request(base, route + '/export', { token: guest.data.token });
  assert.equal(product.status, 200);
  assert.equal(target.status, 200);
  assert.equal(product.data.kind, 'dead-drop-agent-export');
  assert.equal(product.data.scope, 'current-agent-view');
  assert.equal(product.data.mission.role, 'product');
  assert.equal(target.data.mission.role, 'audience');

  const productText = JSON.stringify(product.data);
  const targetText = JSON.stringify(target.data);
  assert.ok(productText.includes(brand.product));
  assert.ok(!productText.includes(audience.audience));
  assert.ok(!productText.includes(audience.friction));
  assert.ok(targetText.includes(audience.audience));
  assert.ok(!targetText.includes(brand.product));
  assert.ok(!targetText.includes(brand.proof));

  for (const text of [productText, targetText]) {
    assert.ok(!text.includes(host.data.token));
    assert.ok(!text.includes(guest.data.token));
    assert.ok(!text.includes('hostTokenHash'));
    assert.ok(!text.includes('guestTokenHash'));
    assert.ok(!text.includes('private-test-key'));
  }
  assert.equal(product.headers.get('cache-control'), 'no-store');
  assert.equal(product.data.mission.expiresAt - product.data.mission.createdAt, WEEK);
});

test('either role can erase the shared room with an exact confirmation code', async t => {
  const { base, app } = await start(t);
  const { route, host, guest } = await createRoom(base);
  const code = host.data.code;
  const sql = app.db.prepare('SELECT payload FROM missions WHERE code = ?').get(code);
  assert.equal(typeof sql.payload, 'string');
  assert.ok(!sql.payload.includes(host.data.token), 'Bearer token must not be persisted verbatim');
  assert.equal(app.db.prepare('PRAGMA secure_delete').get().secure_delete, 1);

  assert.equal((await request(base, route, { method: 'DELETE', body: { confirmCode: code } })).status, 401);
  assert.equal((await request(base, route, { method: 'DELETE', token: 'wrong-token', body: { confirmCode: code } })).status, 403);
  const wrong = await request(base, route, {
    method: 'DELETE', token: guest.data.token, body: { confirmCode: 'NOTTHECODE' }
  });
  assert.equal(wrong.status, 400);
  assert.equal((await request(base, route, { token: host.data.token })).status, 200);

  const erased = await request(base, route, {
    method: 'DELETE', token: guest.data.token, body: { confirmCode: code }
  });
  assert.equal(erased.status, 200);
  assert.deepEqual(erased.data, { deleted: true, code });
  assert.equal(app.db.prepare('SELECT 1 FROM missions WHERE code = ?').get(code), undefined);
  assert.equal((await request(base, route, { token: host.data.token })).status, 404);
  assert.equal((await request(base, route, { token: guest.data.token })).status, 404);
  assert.equal((await request(base, route + '/export', { token: guest.data.token })).status, 404);
  assert.equal((await request(base, route + '/join', { method: 'POST', body: audience })).status, 404);
});

test('expiry pruning removes stale rooms, retains newer rooms, and runs on startup', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'dda-retention-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = join(dir, 'missions.sqlite');
  let time = 1_800_000_000_000;

  const first = createApp({ dbPath: path, now: () => time });
  await new Promise(resolve => first.server.listen(0, '127.0.0.1', resolve));
  const firstBase = 'http://127.0.0.1:' + first.server.address().port;
  const oldRoom = await createRoom(firstBase, false);
  time += WEEK / 2;
  const newRoom = await createRoom(firstBase, false);
  assert.equal(first.db.prepare('SELECT COUNT(*) AS count FROM missions').get().count, 2);

  time += WEEK / 2 + 10;
  assert.equal(first.pruneExpired(), 1);
  assert.equal(first.db.prepare('SELECT COUNT(*) AS count FROM missions').get().count, 1);
  assert.equal((await request(firstBase, oldRoom.route, { token: oldRoom.host.data.token })).status, 404);
  assert.equal((await request(firstBase, newRoom.route, { token: newRoom.host.data.token })).status, 200);

  await new Promise(resolve => first.server.close(resolve));
  first.db.close();

  // A persisted room that expires while the server is offline is pruned on
  // next startup, without requiring a client to open the old link.
  time += WEEK;
  const second = createApp({ dbPath: path, now: () => time });
  assert.equal(second.db.prepare('SELECT COUNT(*) AS count FROM missions').get().count, 0);
  assert.equal(second.pruneExpired(), 0);
  second.db.close();
});

test('deletion is rejected during an AI request so an in-flight model cannot recreate an erased room', async t => {
  let signalStarted;
  let release;
  const active = new Promise(resolve => { signalStarted = resolve; });
  const blocked = new Promise(resolve => { release = resolve; });
  const { base } = await start(t, {
    aiKey: 'test-only-key',
    aiModel: 'test-only-model',
    modelRefiner: async ({ draft }) => {
      signalStarted();
      await blocked;
      return { ...draft, generationMethod: 'ai-assisted' };
    }
  });
  const { route, host, guest } = await createRoom(base);
  for (const token of [host.data.token, guest.data.token]) {
    const consent = await request(base, route + '/ai-consent', {
      method: 'POST', token, body: { allow: true }
    });
    assert.equal(consent.status, 200);
  }
  for (const [token, text] of [
    [host.data.token, 'We have testable product proof'],
    [guest.data.token, 'These people prefer transparent campaigns']
  ]) {
    const message = await request(base, route + '/messages', {
      method: 'POST', token, body: { text }
    });
    assert.equal(message.status, 201);
  }
  const generating = request(base, route + '/finalize', {
    method: 'POST', token: host.data.token, body: { ai: true }
  });
  await active;
  const deletion = await request(base, route, {
    method: 'DELETE', token: guest.data.token, body: { confirmCode: host.data.code }
  });
  assert.equal(deletion.status, 409);
  release();
  const completed = await generating;
  assert.equal(completed.status, 200);
  const erased = await request(base, route, {
    method: 'DELETE', token: guest.data.token, body: { confirmCode: host.data.code }
  });
  assert.equal(erased.status, 200);
  assert.equal((await request(base, route, { token: host.data.token })).status, 404);
});
