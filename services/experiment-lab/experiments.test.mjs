import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../dead-drop/server.mjs';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const op = 'demo-operator-token-with-minimum-32-characters-for-tests';
const payload = {
  title: 'Ritual Coffee Launch',
  audience: 'Independent digital creators with hectic morning routines',
  offer: 'A sample coffee subscription consultation',
  hypothesis: 'Narrative copy increases opt-in CTA response compared with direct benefits copy.',
  controlHeadline: 'Your next coffee ritual deserves a plan',
  controlBody: 'Explore a coffee subscription and read about the sample offer before choosing.',
  variantHeadline: 'A message arrived from the future of your mornings',
  variantBody: 'Every day begins with a decision. Discover what your morning routine could become.',
  ctaLabel: 'Explore this pilot'
};

async function fixture(t, { dbPath = ':memory:', clock = { now: Date.now() }, token = op } = {}) {
  const old = process.env.OPERATOR_TOKEN;
  if (token == null) delete process.env.OPERATOR_TOKEN;
  else process.env.OPERATOR_TOKEN = token;
  t.after(() => {
    if (old === undefined) delete process.env.OPERATOR_TOKEN;
    else process.env.OPERATOR_TOKEN = old;
  });
  const app = createApp({ dbPath, now: () => clock.now });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => app.server.close(resolve));
    app.db.close();
  });
  return { base: 'http://127.0.0.1:' + app.server.address().port, clock, app };
}

async function send(base, path, { method = 'GET', token, body } = {}) {
  const headers = {};
  if (token) headers.Authorization = 'Bearer ' + token;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(base + path, { method, headers,
    body: body === undefined ? undefined : JSON.stringify(body) });
  const contentType = response.headers.get('content-type') || '';
  return {
    status: response.status,
    data: contentType.includes('application/json') ? await response.json() : await response.text(),
    headers: response.headers
  };
}

async function createAndStart(base) {
  const created = await send(base, '/api/v1/operator/experiments', {
    method: 'POST', token: op, body: payload
  });
  assert.equal(created.status, 201);
  const id = created.data.id;
  assert.match(id, /^[a-f0-9]{24}$/);
  const activated = await send(base, '/api/v1/operator/experiments/' + id + '/status', {
    method: 'POST', token: op, body: { status: 'running' }
  });
  assert.equal(activated.status, 200);
  return id;
}

test('Experiment Lab public entrypoints have strict CSP; operator is not accidentally exposed via API', async t => {
  const { base } = await fixture(t);
  const html = await send(base, '/experiments/');
  assert.equal(html.status, 200);
  assert.match(html.data, /EXPERIMENT LAB/);
  assert.match(html.headers.get('content-security-policy'), /script-src 'self'/);
  const operator = await send(base, '/experiments/operator/');
  assert.equal(operator.status, 200);
  assert.match(operator.data, /operatorToken/);
  assert.equal((await send(base, '/experiments/app.js')).status, 200);
  assert.equal((await send(base, '/experiments/operator/app.js')).status, 200);
  assert.equal((await send(base, '/api/v1/operator/experiments')).status, 401);
  assert.equal((await send(base, '/api/v1/operator/experiments', { token: 'incorrect' })).status, 403);
  const empty = await send(base, '/api/v1/experiments');
  assert.equal(empty.status, 200);
  assert.deepEqual(empty.data.items, []);
  assert.equal(empty.headers.get('cache-control'), 'no-store');
});

test('operator can create draft and activate; anonymous catalog hides non-running experiments and editorial draft', async t => {
  const { base } = await fixture(t);
  assert.equal((await send(base, '/api/v1/operator/experiments', { method: 'POST', body: payload })).status, 401);
  assert.equal((await send(base, '/api/v1/operator/experiments', { method: 'POST', token: 'bad', body: payload })).status, 403);
  const invalid = await send(base, '/api/v1/operator/experiments', {
    method: 'POST', token: op, body: { ...payload, controlHeadline: payload.variantHeadline, controlBody: payload.variantBody }
  });
  assert.equal(invalid.status, 422);
  const created = await send(base, '/api/v1/operator/experiments', {
    method: 'POST', token: op, body: payload
  });
  assert.equal(created.status, 201);
  assert.equal(created.data.status, 'draft');
  assert.equal((await send(base, '/api/v1/experiments')).data.items.length, 0);
  const all = await send(base, '/api/v1/operator/experiments', { token: op });
  assert.equal(all.data.items.length, 1);
  assert.equal(all.data.items[0].hypothesis, payload.hypothesis);
  assert.equal(all.data.items[0].metrics.totalExposures, 0);
  assert.equal((await send(base, '/api/v1/operator/experiments/' + created.data.id + '/status', {
    method: 'POST', token: op, body: { status: 'paused' }
  })).status, 409);
  assert.equal((await send(base, '/api/v1/operator/experiments/' + created.data.id + '/status', {
    method: 'POST', token: op, body: { status: 'running' }
  })).status, 200);
  const live = await send(base, '/api/v1/experiments');
  assert.equal(live.data.items.length, 1);
  assert.deepEqual(Object.keys(live.data.items[0]).sort(), ['audience', 'id', 'offer', 'title']);
  assert.equal(JSON.stringify(live.data).includes(payload.hypothesis), false);
  assert.equal(JSON.stringify(live.data).includes(payload.controlBody), false);
});

test('explicit consent, secure session token, idempotent CTA and accurate per-arm counts', async t => {
  const { base } = await fixture(t);
  const id = await createAndStart(base);
  const url = '/api/v1/experiments/' + id + '/sessions';
  assert.equal((await send(base, url, { method: 'POST', body: { consent: false } })).status, 422);
  assert.equal((await send(base, url, { method: 'POST', body: {} })).status, 422);
  const first = await send(base, url, { method: 'POST', body: { consent: true } });
  assert.equal(first.status, 201);
  assert.match(first.data.sessionId, /^[a-f0-9]{32}$/);
  assert.ok(first.data.token.length > 40);
  assert.ok(['A', 'B'].includes(first.data.arm));
  assert.equal(first.data.creative.offer, payload.offer);
  const expectHeadline = first.data.arm === 'A' ? payload.controlHeadline : payload.variantHeadline;
  assert.equal(first.data.creative.headline, expectHeadline);
  assert.equal(Object.hasOwn(first.data, 'email'), false);
  assert.equal(Object.hasOwn(first.data, 'ip'), false);
  const cta = url + '/' + first.data.sessionId + '/cta';
  assert.equal((await send(base, cta, { method: 'POST' })).status, 401);
  assert.equal((await send(base, cta, { method: 'POST', token: 'z'.repeat(44) })).status, 403);
  const posted = await send(base, cta, { method: 'POST', token: first.data.token });
  assert.equal(posted.status, 200);
  assert.equal(posted.data.recorded, true);
  const duplicate = await send(base, cta, { method: 'POST', token: first.data.token });
  assert.equal(duplicate.status, 200);
  assert.equal(duplicate.data.recorded, false);
  assert.equal(duplicate.data.alreadyRecorded, true);
  const report = await send(base, '/api/v1/operator/experiments', { token: op });
  const metrics = report.data.items[0].metrics;
  assert.equal(metrics.totalExposures, 1);
  assert.equal(metrics.totalCTA, 1);
  assert.equal(metrics.arms[first.data.arm].exposures, 1);
  assert.equal(metrics.arms[first.data.arm].cta, 1);
  assert.match(metrics.interpretation, /Not sales/);
});

test('status pause and completion block new assignments without retroactively discarding qualified session CTA', async t => {
  const { base } = await fixture(t);
  const id = await createAndStart(base);
  const url = '/api/v1/experiments/' + id + '/sessions';
  const started = await send(base, url, { method: 'POST', body: { consent: true } });
  assert.equal(started.status, 201);
  assert.equal((await send(base, '/api/v1/operator/experiments/' + id + '/status', {
    method: 'POST', token: op, body: { status: 'paused' }
  })).status, 200);
  assert.equal((await send(base, url, { method: 'POST', body: { consent: true } })).status, 409);
  const olderCTA = await send(base, url + '/' + started.data.sessionId + '/cta',
    { method: 'POST', token: started.data.token });
  assert.equal(olderCTA.status, 200);
  assert.equal((await send(base, '/api/v1/operator/experiments/' + id + '/status', {
    method: 'POST', token: op, body: { status: 'running' }
  })).status, 200);
  assert.equal((await send(base, '/api/v1/operator/experiments/' + id + '/status', {
    method: 'POST', token: op, body: { status: 'completed' }
  })).status, 200);
  assert.equal((await send(base, '/api/v1/operator/experiments/' + id + '/status', {
    method: 'POST', token: op, body: { status: 'running' }
  })).status, 409);
  assert.equal((await send(base, '/api/v1/experiments')).data.items.length, 0);
});

test('retention removes expired session tokens while retaining anonymized 90-day buckets', async t => {
  const clock = { now: Date.parse('2026-10-01T09:00:00Z') };
  const { base } = await fixture(t, { clock });
  const id = await createAndStart(base);
  const path = '/api/v1/experiments/' + id + '/sessions';
  const session = await send(base, path, { method: 'POST', body: { consent: true } });
  assert.equal(session.status, 201);
  clock.now += 8 * DAY;
  assert.equal((await send(base, path + '/' + session.data.sessionId + '/cta', {
    method: 'POST', token: session.data.token
  })).status, 410);
  const report8 = await send(base, '/api/v1/operator/experiments', { token: op });
  assert.equal(report8.data.items[0].metrics.totalExposures, 1);
  clock.now += 92 * DAY;
  const report100 = await send(base, '/api/v1/operator/experiments', { token: op });
  assert.equal(report100.data.items[0].metrics.totalExposures, 0);
});

test('session start is rate limited per address and paid business results are never inferred', async t => {
  const { base } = await fixture(t);
  const id = await createAndStart(base);
  const route = '/api/v1/experiments/' + id + '/sessions';
  for (let i = 0; i < 20; i++) {
    assert.equal((await send(base, route, { method: 'POST', body: { consent: true } })).status, 201);
  }
  assert.equal((await send(base, route, { method: 'POST', body: { consent: true } })).status, 429);
  const stats = (await send(base, '/api/v1/operator/experiments', { token: op })).data.items[0].metrics;
  assert.equal(stats.totalExposures, 20);
  assert.equal(stats.totalCTA, 0);
  assert.equal(stats.sampleRatioWarning, false);
});

test('experiment configuration and anonymized aggregates survive separate application instances', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'iv-exp-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const clock = { now: Date.parse('2026-10-22T12:00:00Z') };
  const dbPath = join(directory, 'experiments.sqlite');
  const first = await fixture(t, { clock, dbPath });
  const id = await createAndStart(first.base);
  const one = await send(first.base, '/api/v1/experiments/' + id + '/sessions',
    { method: 'POST', body: { consent: true } });
  assert.equal(one.status, 201);
  const second = await fixture(t, { clock, dbPath });
  const report = await send(second.base, '/api/v1/operator/experiments', { token: op });
  assert.equal(report.data.items[0].id, id);
  assert.equal(report.data.items[0].metrics.totalExposures, 1);
  const click = await send(second.base,
    '/api/v1/experiments/' + id + '/sessions/' + one.data.sessionId + '/cta',
    { method: 'POST', token: one.data.token });
  assert.equal(click.data.recorded, true);
  const after = await send(first.base, '/api/v1/operator/experiments', { token: op });
  assert.equal(after.data.items[0].metrics.totalCTA, 1);
});

test('operator routes never become available without a configured long secret', async t => {
  const { base } = await fixture(t, { token: '' });
  assert.equal((await send(base, '/api/v1/operator/experiments')).status, 503);
  assert.equal((await send(base, '/api/v1/operator/experiments', { token: op })).status, 503);
  assert.equal((await send(base, '/api/v1/operator/experiments',
    { method: 'POST', token: op, body: payload })).status, 503);
});
