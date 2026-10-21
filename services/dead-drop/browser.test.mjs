import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { createApp } from './server.mjs';

async function setup(t, width = 1400, height = 900) {
  const app = createApp({ dbPath: ':memory:' });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + app.server.address().port;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce'
  });
  t.after(async () => {
    await context.close();
    await browser.close();
    await new Promise(resolve => app.server.close(resolve));
    app.db.close();
  });
  return { browser, context, app, base };
}

function attachErrors(page, errors) {
  page.on('pageerror', error => errors.push('page: ' + error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push('console: ' + message.text());
  });
}

test('two actual browser agents join, exchange signals, preserve secrets, finalize and export', async t => {
  const { browser, context, base } = await setup(t);
  const errors = [];
  const agentA = await context.newPage();
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  t.after(() => mobileContext.close());
  const agentB = await mobileContext.newPage();
  attachErrors(agentA, errors);
  attachErrors(agentB, errors);

  await agentA.goto(base + '/apps/dead-drop/');
  await agentA.getByRole('button', { name: /Create a mission/i }).click();
  await agentA.locator('#brand').fill('Northstar Coffee');
  await agentA.locator('#product').fill('Fresh roasted subscription coffee');
  await agentA.locator('#proof').fill('Shipping invoices from a controlled pilot');
  await agentA.locator('#objective').selectOption('leads');
  await agentA.getByRole('button', { name: /CREATE CLASSIFIED ROOM/i }).click();
  await agentA.locator('.room-code strong').waitFor();
  const code = (await agentA.locator('.room-code strong').textContent()).trim();
  assert.match(code, /^[A-Z2-9]{8}$/);

  await agentB.goto(base + '/apps/dead-drop/');
  await agentB.getByRole('button', { name: /Join as Agent Echo/i }).click();
  await agentB.locator('#roomCode').fill(code);
  await agentB.locator('#audience').fill('Independent creative directors');
  await agentB.locator('#friction').fill('Their mornings are unpredictable');
  await agentB.locator('#channel').selectOption('video');
  await agentB.getByRole('button', { name: /JOIN CLASSIFIED OPERATION/i }).click();
  await agentB.locator('.room-grid').waitFor();

  assert.ok(!(await agentB.locator('body').innerText()).includes('Fresh roasted subscription coffee'));
  await agentA.waitForFunction(() => document.body.innerText.includes('Both operatives are in position.'), { timeout: 9000 });
  assert.ok(!(await agentA.locator('body').innerText()).includes('Independent creative directors'));

  await agentA.locator('#messageText').fill('What objection matters most to this audience?');
  await agentA.getByRole('button', { name: /TRANSMIT/i }).click();
  await agentB.locator('#messageText').fill('They need a reliable ritual they can control.');
  await agentB.getByRole('button', { name: /TRANSMIT/i }).click();
  await agentA.waitForFunction(() => document.body.innerText.includes('They need a reliable ritual'), { timeout: 9000 });

  mkdirSync('artifacts', { recursive: true });
  await agentB.screenshot({ path: 'artifacts/dead-drop-mobile-room.png', fullPage: true });
  const isOverflowing = await agentB.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  assert.equal(isOverflowing, false, 'Mobile layout should not scroll horizontally');

  await agentA.getByRole('button', { name: /DECODE THE CREATIVE DOSSIER/i }).click();
  await agentA.getByText('Signal decoded.').waitFor();
  const result = await agentA.locator('body').innerText();
  assert.match(result, /Fresh roasted subscription coffee/);
  assert.match(result, /Independent creative directors/);
  assert.match(result, /not been independently verified/);
  await agentA.screenshot({ path: 'artifacts/dead-drop-desktop-dossier.png', fullPage: true });

  const downloadPromise = agentA.waitForEvent('download');
  await agentA.getByRole('button', { name: /EXPORT .TXT/i }).click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /dead-drop-dossier\.txt/);
  assert.deepEqual(errors, []);
});

test('local simulation exercises both roles without server multiplayer state', async t => {
  const { context, base } = await setup(t, 430, 850);
  const page = await context.newPage();
  const errors = [];
  attachErrors(page, errors);
  await page.goto(base + '/apps/dead-drop/');
  await page.getByRole('button', { name: /Training simulation/i }).click();
  await page.locator('#brand').fill('Sample Studio');
  await page.locator('#product').fill('Creative workshop subscription');
  await page.locator('#proof').fill('Demonstration of the complete workflow');
  await page.getByRole('button', { name: /CONTINUE TO AGENT ECHO/i }).click();
  await page.locator('#audience').fill('Freelance illustrators');
  await page.locator('#friction').fill('Unpredictable client briefs');
  await page.locator('#channel').selectOption('landing');
  await page.getByRole('button', { name: /START TRAINING EXCHANGE/i }).click();
  await page.locator('#messageText').fill('What is their biggest obstacle?');
  await page.getByRole('button', { name: /TRANSMIT/i }).click();
  await page.getByRole('button', { name: /SWITCH TO AGENT ECHO/i }).click();
  await page.locator('#messageText').fill('They need clarity before committing.');
  await page.getByRole('button', { name: /TRANSMIT/i }).click();
  await page.getByRole('button', { name: /DECODE THE CREATIVE DOSSIER/i }).click();
  await page.getByText('Signal decoded.').waitFor();
  assert.match(await page.locator('body').innerText(), /Freelance illustrators/);
  assert.deepEqual(errors, []);
});
