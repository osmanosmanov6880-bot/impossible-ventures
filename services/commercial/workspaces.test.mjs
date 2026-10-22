import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';

const SYSTEM = 'test-system-master-secret-0123456789abcdef';
const DAY = 86_400_000;
const full = '/api/v1/operator/workspaces';

async function fixture(t, now = { value: Date.now() }) {
  const previous = process.env.OPERATOR_TOKEN;
  process.env.OPERATOR_TOKEN = SYSTEM;
  t.after(() => previous === undefined ? delete process.env.OPERATOR_TOKEN : process.env.OPERATOR_TOKEN = previous);
  const app = createApp({ dbPath: ':memory:', now: () => now.value });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => app.server.close(resolve)); app.db.close(); });
  return { base: 'http://127.0.0.1:' + app.server.address().port, now };
}
async function api(base, path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (token) headers.Authorization = 'Bearer ' + token;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(base + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: res.status, data: await res.json() };
}
async function bootstrap(base, name = 'Global Creative Group') {
  const response = await api(base, full, { method: 'POST', token: SYSTEM, body: { name } });
  assert.equal(response.status, 201);
  return response.data;
}

test('WAVE 2: only system operator provisions a workspace, no secrets leak in listing', async t => {
  const { base } = await fixture(t);
  assert.equal((await api(base, full, { method: 'POST', body: { name: 'No auth' } })).status, 401);
  assert.equal((await api(base, full, { method: 'POST', token: 'bad', body: { name: 'No auth' } })).status, 403);
  assert.equal((await api(base, full, { method: 'POST', token: SYSTEM, body: { name: 'a' } })).status, 400);
  const created = await bootstrap(base);
  assert.match(created.workspace.id, /^[a-f0-9]{24}$/);
  assert.match(created.ownerCredential.token, /^ivw_/);
  const listing = await api(base, full, { token: SYSTEM });
  assert.equal(listing.data.total, 1);
  assert.equal(JSON.stringify(listing.data).includes(created.ownerCredential.token), false);
  const own = await api(base, '/api/v1/workspaces/' + created.workspace.id, { token: created.ownerCredential.token });
  assert.equal(own.status, 200);
  assert.equal(own.data.credential.role, 'owner');
  assert.equal(JSON.stringify(own.data).includes(created.ownerCredential.token), false);
});

test('WAVE 2: owner issues limited credential, viewer cannot escalate, revocation is effective', async t => {
  const { base } = await fixture(t);
  const owner = await bootstrap(base);
  const root = '/api/v1/workspaces/' + owner.workspace.id;
  const viewer = await api(base, root + '/tokens', {
    method: 'POST', token: owner.ownerCredential.token,
    body: { label: 'Read-only CFO', role: 'viewer', ttlDays: 5 }
  });
  assert.equal(viewer.status, 201);
  assert.equal(viewer.data.credential.role, 'viewer');
  assert.equal((await api(base, root, { token: viewer.data.token })).status, 200);
  assert.equal((await api(base, root + '/tokens', { token: viewer.data.token })).status, 403);
  assert.equal((await api(base, root + '/tokens', {
    method: 'POST', token: viewer.data.token, body: { label: 'Escalate', role: 'editor' }
  })).status, 403);
  assert.equal((await api(base, root + '/tokens', {
    method: 'POST', token: owner.ownerCredential.token, body: { label: 'Owner 2', role: 'owner' }
  })).status, 400);
  assert.equal((await api(base, root + '/tokens/' + owner.ownerCredential.id + '/revoke', {
    method: 'POST', token: owner.ownerCredential.token
  })).status, 409);
  const revoked = await api(base, root + '/tokens/' + viewer.data.credential.id + '/revoke', {
    method: 'POST', token: owner.ownerCredential.token
  });
  assert.equal(revoked.status, 200);
  assert.equal((await api(base, root, { token: viewer.data.token })).status, 403);
  const tokens = await api(base, root + '/tokens', { token: owner.ownerCredential.token });
  assert.equal(tokens.data.items.length, 2);
  assert.ok(tokens.data.items.some(item => item.id === viewer.data.credential.id && item.revokedAt !== null));
});

test('WAVE 2: tenant token never authorizes another workspace, token expiration enforced', async t => {
  const now = { value: Date.parse('2026-10-22T00:00:00Z') };
  const { base } = await fixture(t, now);
  const one = await bootstrap(base, 'Agency One');
  const two = await bootstrap(base, 'Agency Two');
  const p = '/api/v1/workspaces/' + one.workspace.id;
  const created = await api(base, p + '/tokens', {
    method: 'POST', token: one.ownerCredential.token,
    body: { label: 'One-day editor', role: 'editor', ttlDays: 1 }
  });
  assert.equal(created.status, 201);
  assert.equal((await api(base, '/api/v1/workspaces/' + two.workspace.id, {
    token: created.data.token
  })).status, 403);
  now.value += 2 * DAY;
  assert.equal((await api(base, p, { token: created.data.token })).status, 403);
  assert.equal((await api(base, p, { token: one.ownerCredential.token })).status, 200);
});

test('WAVE 2: system can rotate owner credential, old owner disabled and audit records actions', async t => {
  const { base } = await fixture(t);
  const workspace = await bootstrap(base);
  const p = '/api/v1/workspaces/' + workspace.workspace.id;
  const rotated = await api(base, full + '/' + workspace.workspace.id + '/rotate-owner', {
    method: 'POST', token: SYSTEM
  });
  assert.equal(rotated.status, 200);
  assert.notEqual(rotated.data.ownerCredential.token, workspace.ownerCredential.token);
  assert.equal((await api(base, p, { token: workspace.ownerCredential.token })).status, 403);
  const nowOwner = rotated.data.ownerCredential.token;
  assert.equal((await api(base, p, { token: nowOwner })).status, 200);
  const audit = await api(base, p + '/audit', { token: nowOwner });
  assert.equal(audit.status, 200);
  assert.ok(audit.data.items.some(x => x.action === 'workspace.created'));
  assert.ok(audit.data.items.some(x => x.action === 'owner.rotated'));
  assert.equal(JSON.stringify(audit.data).includes(nowOwner), false);
});
