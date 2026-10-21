import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './server.mjs';

async function fixture(t, dbPath = ':memory:', options = {}) {
  const app = createApp({ dbPath, ...options });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  const address = app.server.address();
  const base = 'http://127.0.0.1:' + address.port;
  t.after(async () => {
    await new Promise(resolve => app.server.close(resolve));
    app.db.close();
  });
  return base;
}

async function request(base, path, { method = 'GET', token, body, contentType = 'application/json' } = {}) {
  const headers = {};
  if (token) headers.Authorization = 'Bearer ' + token;
  if (body !== undefined) headers['Content-Type'] = contentType;
  const response = await fetch(base + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const type = response.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await response.json() : await response.text();
  return { status: response.status, data, headers: response.headers };
}

const productIntel = {
  brand: 'Northstar Coffee',
  product: 'Fresh roasted subscription coffee',
  proof: 'Orders ship within two business days according to our internal log',
  objective: 'leads'
};
const audienceIntel = {
  audience: 'Busy freelance designers',
  friction: 'The morning ritual takes too much time',
  channel: 'video'
};

test('health endpoint and public files are served with correct headers', async t => {
  const base = await fixture(t);
  const health = await request(base, '/api/v1/health');
  assert.equal(health.status, 200);
  assert.equal(health.data.ok, true);
  assert.equal(health.data.mode, 'cooperative');
  const html = await request(base, '/apps/dead-drop/');
  assert.equal(html.status, 200);
  assert.match(html.data, /<title>Dead Drop Agency/);
  assert.match(html.headers.get('content-security-policy'), /script-src 'self'/);
  const js = await request(base, '/apps/dead-drop/app.js');
  assert.equal(js.status, 200);
  assert.match(js.data, /TRAINING/);
  const notFound = await request(base, '/.env');
  assert.equal(notFound.status, 404);
});

test('request validation rejects missing fields and unsupported content types', async t => {
  const base = await fixture(t);
  const invalid = await request(base, '/api/v1/missions', { method: 'POST', body: { brand: 'ok' } });
  assert.equal(invalid.status, 400);
  const wrongContent = await request(base, '/api/v1/missions', {
    method: 'POST',
    body: productIntel,
    contentType: 'text/plain'
  });
  assert.equal(wrongContent.status, 415);
  const badObjective = await request(base, '/api/v1/missions', {
    method: 'POST', body: { ...productIntel, objective: 'clicks' }
  });
  assert.equal(badObjective.status, 400);
});

test('agents see their own private intelligence, exchange limited signals and decode a dossier', async t => {
  const base = await fixture(t);
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: productIntel });
  assert.equal(host.status, 201);
  assert.match(host.data.code, /^[A-Z2-9]{8}$/);
  assert.equal(host.data.mission.role, 'product');
  assert.equal(host.data.mission.joined, false);
  assert.equal(host.data.mission.ownIntel.product, productIntel.product);
  assert.equal(typeof host.data.token, 'string');

  const path = '/api/v1/missions/' + host.data.code;
  assert.equal((await request(base, path)).status, 401);
  assert.equal((await request(base, path, { token: 'invalid-token' })).status, 403);
  assert.equal((await request(base, path + '/messages', { method: 'POST', token: host.data.token, body: { text: 'Testing' } })).status, 409);

  const guest = await request(base, path + '/join', { method: 'POST', body: audienceIntel });
  assert.equal(guest.status, 201);
  assert.equal(guest.data.mission.role, 'audience');
  assert.equal(guest.data.mission.ownIntel.audience, audienceIntel.audience);
  assert.ok(!JSON.stringify(guest.data.mission).includes(productIntel.product));
  assert.ok(!JSON.stringify(guest.data.mission).includes(productIntel.proof));

  const hostView = await request(base, path, { token: host.data.token });
  assert.equal(hostView.status, 200);
  assert.ok(!JSON.stringify(hostView.data.mission).includes(audienceIntel.audience));
  assert.ok(!JSON.stringify(hostView.data.mission).includes(audienceIntel.friction));
  assert.equal((await request(base, path + '/finalize', {
    method: 'POST', token: host.data.token, body: {}
  })).status, 409);

  const signalA = await request(base, path + '/messages', {
    method: 'POST', token: host.data.token,
    body: { text: 'We can demonstrate faster delivery with shipping logs.' }
  });
  assert.equal(signalA.status, 201);
  const signalB = await request(base, path + '/messages', {
    method: 'POST', token: guest.data.token,
    body: { text: 'Our audience struggles with inconsistent morning routines.' }
  });
  assert.equal(signalB.status, 201);
  assert.equal(signalB.data.mission.quota.used, 1);
  assert.equal(signalB.data.mission.quota.partnerUsed, 1);

  const finale = await request(base, path + '/finalize', {
    method: 'POST', token: host.data.token, body: {}
  });
  assert.equal(finale.status, 200);
  assert.equal(finale.data.mission.status, 'finalized');
  const dossier = finale.data.mission.dossier;
  assert.equal(dossier.storyboard.length, 3);
  assert.match(dossier.concept, /Fresh roasted subscription coffee/);
  assert.match(dossier.concept, /Busy freelance designers/);
  assert.match(dossier.disclosure, /not been independently verified/);
  assert.match(dossier.interceptedSignals.audienceAgent, /morning routines/);
  assert.equal((await request(base, path + '/join', { method: 'POST', body: audienceIntel })).status, 409);
  assert.equal((await request(base, path + '/messages', {
    method: 'POST', token: guest.data.token, body: { text: 'Too late' }
  })).status, 409);
});

test('per-agent transmission quota cannot be bypassed', async t => {
  const base = await fixture(t);
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: productIntel });
  const path = '/api/v1/missions/' + host.data.code;
  await request(base, path + '/join', { method: 'POST', body: audienceIntel });
  for (let number = 0; number < 3; number++) {
    const response = await request(base, path + '/messages', {
      method: 'POST', token: host.data.token, body: { text: 'Signal number ' + number }
    });
    assert.equal(response.status, 201);
  }
  const fourth = await request(base, path + '/messages', {
    method: 'POST', token: host.data.token, body: { text: 'Signal number four' }
  });
  assert.equal(fourth.status, 409);
  const after = await request(base, path, { token: host.data.token });
  assert.equal(after.data.mission.quota.used, 3);
});

test('SQLite retains the session across process-level application restarts', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'dead-drop-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const dbPath = join(directory, 'missions.sqlite');
  const first = await fixture(t, dbPath);
  const host = await request(first, '/api/v1/missions', { method: 'POST', body: productIntel });
  const code = host.data.code;
  const saved = await request(first, '/api/v1/missions/' + code, { token: host.data.token });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.mission.ownIntel.product, productIntel.product);
  // Reopening in another application instance exercises durable SQLite state.
  const second = await fixture(t, dbPath);
  const reloaded = await request(second, '/api/v1/missions/' + code, { token: host.data.token });
  assert.equal(reloaded.status, 200);
  assert.equal(reloaded.data.mission.brand, productIntel.brand);
});


test('simultaneous invite joins are atomic: exactly one audience agent can claim a room', async t => {
  const base = await fixture(t);
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: productIntel });
  const path = '/api/v1/missions/' + host.data.code + '/join';
  const joins = await Promise.all(Array.from({ length: 6 }, (_, index) => request(base, path, {
    method: 'POST',
    body: { ...audienceIntel, audience: 'Audience candidate ' + index }
  })));
  assert.equal(joins.filter(r => r.status === 201).length, 1);
  assert.equal(joins.filter(r => r.status === 409).length, 5);
  const room = await request(base, '/api/v1/missions/' + host.data.code, { token: host.data.token });
  assert.equal(room.data.mission.joined, true);
});

test('concurrent messages never bypass role quotas', async t => {
  const base = await fixture(t);
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: productIntel });
  const path = '/api/v1/missions/' + host.data.code;
  await request(base, path + '/join', { method: 'POST', body: audienceIntel });
  const sends = await Promise.all(Array.from({ length: 9 }, (_, index) => request(base, path + '/messages', {
    method: 'POST', token: host.data.token, body: { text: 'Concurrent message ' + index }
  })));
  assert.equal(sends.filter(x => x.status === 201).length, 3);
  assert.equal(sends.filter(x => x.status === 409).length, 6);
  const room = await request(base, path, { token: host.data.token });
  assert.equal(room.data.mission.quota.used, 3);
});

test('AI is not called without explicit opt-in, even if the server has a key', async t => {
  let calls = 0;
  const base = await fixture(t, ':memory:', {
    aiKey: 'private-test-key',
    aiModel: 'test-model',
    modelRefiner: async () => {
      calls++;
      throw new Error('Should not be called');
    }
  });
  const health = await request(base, '/api/v1/health');
  assert.equal(health.data.aiAvailable, true);
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: productIntel });
  const path = '/api/v1/missions/' + host.data.code;
  const guest = await request(base, path + '/join', { method: 'POST', body: audienceIntel });
  await request(base, path + '/messages', { method: 'POST', token: host.data.token, body: { text: 'We can prove delivery speed.' } });
  await request(base, path + '/messages', { method: 'POST', token: guest.data.token, body: { text: 'A reliable morning habit.' } });
  const finale = await request(base, path + '/finalize', {
    method: 'POST', token: host.data.token, body: {}
  });
  assert.equal(finale.status, 200);
  assert.equal(finale.data.mission.dossier.generationMethod, 'rules');
  assert.equal(calls, 0);
});

test('explicit AI consent invokes the refiner once, retaining fallback when model fails', async t => {
  let calls = 0;
  const base = await fixture(t, ':memory:', {
    aiKey: 'private-test-key',
    aiModel: 'test-model',
    modelRefiner: async ({ draft, language, apiKey }) => {
      calls++;
      assert.equal(language, 'zh');
      assert.equal(apiKey, 'private-test-key');
      return { ...draft, concept: 'Optional creative revision from a test model', generationMethod: 'ai-assisted' };
    }
  });
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: productIntel });
  const path = '/api/v1/missions/' + host.data.code;
  const guest = await request(base, path + '/join', { method: 'POST', body: audienceIntel });
  await request(base, path + '/messages', { method: 'POST', token: host.data.token, body: { text: 'Our product has proof.' } });
  await request(base, path + '/messages', { method: 'POST', token: guest.data.token, body: { text: 'They need a better morning ritual.' } });
  const finale = await request(base, path + '/finalize', {
    method: 'POST', token: host.data.token, body: { ai: true, language: 'zh' }
  });
  assert.equal(finale.status, 200);
  assert.equal(finale.data.mission.dossier.generationMethod, 'ai-assisted');
  assert.equal(calls, 1);
  assert.equal((await request(base, path + '/finalize', {
    method: 'POST', token: host.data.token, body: { ai: true, language: 'zh' }
  })).status, 409);
  assert.equal(calls, 1);
});

test('provider errors fall back to deterministic dossier without losing a mission', async t => {
  const base = await fixture(t, ':memory:', {
    aiKey: 'private-test-key',
    aiModel: 'test-model',
    modelRefiner: async () => { throw new Error('Simulated API network outage'); }
  });
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: productIntel });
  const path = '/api/v1/missions/' + host.data.code;
  const guest = await request(base, path + '/join', { method: 'POST', body: audienceIntel });
  await request(base, path + '/messages', { method: 'POST', token: host.data.token, body: { text: 'We can offer delivery tracking.' } });
  await request(base, path + '/messages', { method: 'POST', token: guest.data.token, body: { text: 'People want consistency.' } });
  const result = await request(base, path + '/finalize', { method: 'POST', token: guest.data.token, body: { ai: true } });
  assert.equal(result.status, 200);
  assert.equal(result.data.mission.dossier.generationMethod, 'rules');
  assert.match(result.data.mission.dossier.aiNotice, /unavailable/);
  assert.equal(result.data.mission.status, 'finalized');
});

test('finalization lock blocks duplicate model costs and mid-generation writes', async t => {
  let started;
  let unblock;
  const startedPromise = new Promise(resolve => { started = resolve; });
  const modelPromise = new Promise(resolve => { unblock = resolve; });
  const base = await fixture(t, ':memory:', {
    aiKey: 'private-test-key',
    aiModel: 'test-model',
    modelRefiner: async ({ draft }) => {
      started();
      await modelPromise;
      return { ...draft, generationMethod: 'ai-assisted' };
    }
  });
  const host = await request(base, '/api/v1/missions', { method: 'POST', body: productIntel });
  const path = '/api/v1/missions/' + host.data.code;
  const guest = await request(base, path + '/join', { method: 'POST', body: audienceIntel });
  await request(base, path + '/messages', { method: 'POST', token: host.data.token, body: { text: 'Our shipment tracking is documented.' } });
  await request(base, path + '/messages', { method: 'POST', token: guest.data.token, body: { text: 'Quality matters more than novelty.' } });
  const firstFinalization = request(base, path + '/finalize', { method: 'POST', token: host.data.token, body: { ai: true } });
  await startedPromise;
  const duplicate = await request(base, path + '/finalize', { method: 'POST', token: guest.data.token, body: { ai: true } });
  assert.equal(duplicate.status, 409);
  const lateMessage = await request(base, path + '/messages', {
    method: 'POST', token: guest.data.token, body: { text: 'Late transmission should be blocked.' }
  });
  assert.equal(lateMessage.status, 409);
  unblock();
  const completed = await firstFinalization;
  assert.equal(completed.status, 200);
  assert.equal(completed.data.mission.dossier.generationMethod, 'ai-assisted');
});
