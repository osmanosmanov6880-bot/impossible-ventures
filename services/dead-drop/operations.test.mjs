import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './server.mjs';

async function fixture(t) {
  const app = createApp({ dbPath: ':memory:' });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => app.server.close(resolve));
    app.db.close();
  });
  return { app, base: 'http://127.0.0.1:' + app.server.address().port };
}

test('health and readiness verify a rolled-back database write; liveness is independent', async t => {
  const { app, base } = await fixture(t);
  const live = await fetch(base + '/api/v1/live');
  const health = await fetch(base + '/api/v1/health');
  const ready = await fetch(base + '/api/v1/ready');
  assert.equal(live.status, 200);
  assert.equal(health.status, 200);
  assert.equal(ready.status, 200);
  assert.deepEqual(await live.json(), { ok: true, service: 'impossible-ventures', check: 'process' });
  const healthJSON = await health.json();
  assert.equal(healthJSON.ok, true);
  assert.equal(healthJSON.mode, 'cooperative'); // legacy consumer contract
  assert.equal(healthJSON.storage, 'writable');
  assert.equal(healthJSON.check, 'sqlite-transaction');
  assert.equal(healthJSON.version, '1.8.0-beta.1');
  assert.equal(health.headers.get('cache-control'), 'no-store');
  assert.deepEqual((await ready.json()).storage, 'writable');
  assert.equal(
    app.db.prepare('SELECT COUNT(*) AS count FROM runtime_healthcheck').get().count,
    0,
    'Readiness probes must not persist a telemetry row'
  );
});

test('readiness returns HTTP 503 when transactional storage fails, without leaking exception or customer information', async t => {
  const { app, base } = await fixture(t);
  app.db.exec('DROP TABLE runtime_healthcheck');
  const ready = await fetch(base + '/api/v1/ready');
  assert.equal(ready.status, 503);
  const body = await ready.json();
  assert.equal(body.ok, false);
  assert.equal(body.storage, 'unavailable');
  assert.equal(JSON.stringify(body).includes('SQLITE'), false);
  assert.equal(JSON.stringify(body).includes('DELETE FROM'), false);
  const health = await fetch(base + '/api/v1/health');
  assert.equal(health.status, 503);
  const live = await fetch(base + '/api/v1/live');
  assert.equal(live.status, 200);
  assert.equal((await live.json()).ok, true);

  app.db.exec('CREATE TABLE runtime_healthcheck (id INTEGER PRIMARY KEY, touched_at INTEGER NOT NULL)');
  assert.equal((await fetch(base + '/api/v1/ready')).status, 200);
});

test('public status page is translated, CSP-restricted and reveals no pilot contacts', async t => {
  const { base } = await fixture(t);
  for (const path of ['/status/', '/status/index.html']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
    const html = await response.text();
    assert.match(html, /id="statusPlate"/);
    assert.match(html, /id="storageMetric"/);
    assert.match(html, /Русский/);
    assert.match(html, /English/);
    assert.match(html, /中文/);
    assert.match(html, /data-i18n="disclaimer"/);
  }
  for (const [path,fragment] of [
    ['/status/app.js', 'sqlite-transaction'],
    ['/status/style.css', '.status-plate']
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    const body = await response.text();
    if (path.endsWith('app.js')) {
      assert.match(body, /\/api\/v1\/ready/);
      assert.match(body, /statusPlate/);
    } else {
      assert.ok(body.includes(fragment));
    }
  }
  const missing = await fetch(base + '/status/secret.db');
  assert.equal(missing.status, 404);
});
