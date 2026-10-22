import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { createApp } from './server.mjs';

async function setup(t, width = 1400, height = 900, options = {}) {
  const app = createApp({ dbPath: ':memory:', ...options });
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
  assert.equal(await agentA.locator('[data-action="delete-mission"]').count(), 1);
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


test('language switch changes the interface in RU and ZH and preserves unfinished input', async t => {
  const { context, base } = await setup(t, 390, 844);
  const page = await context.newPage();
  const errors = [];
  attachErrors(page, errors);
  await page.goto(base + '/apps/dead-drop/');
  await page.locator('#languageSelect').selectOption('ru');
  await page.getByText('Большие идеи').waitFor();
  await page.getByRole('button', { name: /Создать миссию/i }).click();
  await page.locator('#brand').fill('Мастерская Арктика');
  await page.locator('#product').fill('Подписка на мастер-классы');
  await page.locator('#proof').fill('Есть видеозапись открытого мастер-класса');
  await page.locator('#languageSelect').selectOption('zh');
  assert.equal(await page.locator('#brand').inputValue(), 'Мастерская Арктика');
  assert.equal(await page.locator('#product').inputValue(), 'Подписка на мастер-классы');
  await page.getByText('定义').waitFor({ timeout: 3000 }).catch(async () => {
    // Some languages join a headline with another text node.
    assert.match(await page.locator('.screen-heading').innerText(), /定义/);
  });
  await page.locator('#languageSelect').selectOption('en');
  assert.equal(await page.locator('#brand').inputValue(), 'Мастерская Арктика');
  await page.getByRole('button', { name: /CREATE CLASSIFIED ROOM/i }).waitFor();
  assert.deepEqual(errors, []);
});

test('offline training creates a localized Russian dossier without any AI processing', async t => {
  const { context, base } = await setup(t, 430, 844);
  const page = await context.newPage();
  const errors = [];
  attachErrors(page, errors);
  await page.goto(base + '/apps/dead-drop/');
  await page.locator('#languageSelect').selectOption('ru');
  await page.getByRole('button', { name: /Тренировочная миссия/i }).click();
  await page.locator('#brand').fill('Студия Маяк');
  await page.locator('#product').fill('Обучающая программа по дизайну');
  await page.locator('#proof').fill('Доступен бесплатный ознакомительный урок');
  await page.locator('#objective').selectOption('awareness');
  await page.locator('#hostForm').evaluate(form => form.requestSubmit());
  await page.locator('#audience').fill('Молодые предприниматели');
  await page.locator('#friction').fill('Сложно выбрать полезную программу');
  await page.locator('#channel').selectOption('social');
  await page.locator('#trainingGuestForm').evaluate(form => form.requestSubmit());
  await page.locator('#messageText').fill('Какая проблема волнует аудиторию?');
  await page.locator('#messageForm').evaluate(form => form.requestSubmit());
  await page.locator('[data-action="switch-role"]').click();
  await page.locator('#messageText').fill('Нужны понятные доказательства пользы');
  await page.locator('#messageForm').evaluate(form => form.requestSubmit());
  await page.locator('[data-action="finalize"]').click();
  await page.getByText('расшифрован.').waitFor();
  const result = await page.locator('.dossier-grid').first().innerText();
  assert.match(result, /Молодые предприниматели/);
  assert.match(result, /Превратите знакомую проблему/);
  assert.deepEqual(errors, []);
});

test('both agents consent independently before model assistance is available', async t => {
  let modelCalls = 0;
  const { context, browser, base } = await setup(t, 1300, 900, {
    aiKey: 'test-no-network',
    aiModel: 'fake-model',
    modelRefiner: async ({ draft }) => {
      modelCalls++;
      return { ...draft, generationMethod: 'ai-assisted', concept: 'Agent-tested creative concept' };
    }
  });
  const secondContext = await browser.newContext({ viewport: { width: 425, height: 850 } });
  t.after(() => secondContext.close());
  const hostPage = await context.newPage();
  const guestPage = await secondContext.newPage();
  const errors = [];
  attachErrors(hostPage, errors);
  attachErrors(guestPage, errors);

  await hostPage.goto(base + '/apps/dead-drop/');
  await hostPage.getByRole('button', { name: /Create a mission/i }).click();
  await hostPage.locator('#brand').fill('Cipher Studio');
  await hostPage.locator('#product').fill('Creative research toolkit');
  await hostPage.locator('#proof').fill('Documented public product demonstrations');
  await hostPage.locator('#objective').selectOption('leads');
  await hostPage.locator('#hostForm').evaluate(form => form.requestSubmit());
  await hostPage.locator('.room-code strong').waitFor();
  const roomCode = (await hostPage.locator('.room-code strong').textContent()).trim();

  await guestPage.goto(base + '/apps/dead-drop/');
  await guestPage.getByRole('button', { name: /Join as Agent Echo/i }).click();
  await guestPage.locator('#roomCode').fill(roomCode);
  await guestPage.locator('#audience').fill('Independent design agencies');
  await guestPage.locator('#friction').fill('Brief quality changes from client to client');
  await guestPage.locator('#channel').selectOption('landing');
  await guestPage.locator('#guestForm').evaluate(form => form.requestSubmit());
  await guestPage.locator('#aiConsent').waitFor();

  // After only one agent consents, no AI call may happen.
  await guestPage.locator('#aiConsent').check();
  await guestPage.waitForFunction(() => document.querySelector('.ai-consent-state')?.innerText.includes('YOUR CONSENT: GRANTED'));
  await hostPage.locator('#aiConsent').waitFor();
  await hostPage.waitForFunction(() => document.querySelector('.ai-consent-state')?.innerText.includes('PARTNER CONSENT: GRANTED'), { timeout: 9000 });
  assert.equal(modelCalls, 0);
  await hostPage.locator('#aiConsent').check();
  await hostPage.waitForFunction(() => document.querySelector('.ai-consent-state')?.innerText.includes('YOUR CONSENT: GRANTED'));
  await guestPage.waitForFunction(() => document.querySelector('.ai-consent-state')?.innerText.includes('PARTNER CONSENT: GRANTED'), { timeout: 9000 });

  await hostPage.locator('#messageText').fill('Can we show the actual research workflow?');
  await hostPage.locator('#messageForm').evaluate(form => form.requestSubmit());
  await guestPage.locator('#messageText').fill('Agencies need clear expectations before kickoff.');
  await guestPage.locator('#messageForm').evaluate(form => form.requestSubmit());
  await hostPage.waitForFunction(() => document.body.innerText.includes('Agencies need clear expectations'), { timeout: 9000 });
  await hostPage.locator('[data-action="finalize"]').click();
  await hostPage.getByText('AI-ASSISTED CREATIVE DRAFT').waitFor();
  assert.equal(modelCalls, 1);
  assert.deepEqual(errors, []);
});


test('browser exports only one agent view, confirms erasure and revokes both sessions', async t => {
  const { browser, context, base } = await setup(t);
  const host = await context.newPage();
  const guestContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce'
  });
  t.after(() => guestContext.close());
  const guest = await guestContext.newPage();
  const errors = [];
  const notFoundResponses = [];
  for (const page of [host, guest]) {
    attachErrors(page, errors);
    page.on('response', response => {
      if (response.status() === 404) notFoundResponses.push(response.url());
    });
  }

  await host.goto(base + '/apps/dead-drop/');
  await host.getByRole('button', { name: /Create a mission/i }).click();
  await host.locator('#brand').fill('Aurora Studio');
  await host.locator('#product').fill('PRIVATE PRODUCT: subscription learning toolkit');
  await host.locator('#proof').fill('PRIVATE EVIDENCE: documented demo classes');
  await host.locator('#hostForm').evaluate(form => form.requestSubmit());
  await host.locator('.room-code strong').waitFor();
  const code = (await host.locator('.room-code strong').textContent()).trim();

  await guest.goto(base + '/apps/dead-drop/');
  await guest.getByRole('button', { name: /Join as Agent Echo/i }).click();
  await guest.locator('#roomCode').fill(code);
  await guest.locator('#audience').fill('Independent creative agencies');
  await guest.locator('#friction').fill('Clients send confusing briefs');
  await guest.locator('#channel').selectOption('social');
  await guest.locator('#guestForm').evaluate(form => form.requestSubmit());
  await guest.locator('[data-action="export-my-data"]').waitFor();

  mkdirSync('artifacts', { recursive: true });
  await guest.screenshot({ path: 'artifacts/dead-drop-mobile-privacy.png', fullPage: true });
  assert.equal(await guest.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false);

  const downloadPromise = guest.waitForEvent('download');
  await guest.locator('[data-action="export-my-data"]').click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /dead-drop-[a-z2-9]{8}-audience-data\.json/);
  const exportJSON = JSON.parse(readFileSync(await download.path(), 'utf8'));
  assert.equal(exportJSON.kind, 'dead-drop-agent-export');
  assert.equal(exportJSON.mission.role, 'audience');
  const serialized = JSON.stringify(exportJSON);
  assert.ok(!serialized.includes('PRIVATE PRODUCT:'));
  assert.ok(!serialized.includes('PRIVATE EVIDENCE:'));
  assert.ok(!serialized.includes('hostTokenHash'));
  assert.ok(!serialized.includes('guestTokenHash'));

  await guest.locator('[data-action="delete-mission"]').click();
  const dialog = guest.locator('#deleteDialog');
  await dialog.waitFor({ state: 'visible' });
  await guest.locator('#deleteConfirmCode').fill('BADCODE');
  await guest.locator('#confirmDeleteButton').click();
  await guest.getByText('The room code does not match.').waitFor();
  assert.equal(await dialog.isVisible(), true);

  await guest.locator('#deleteConfirmCode').fill(code);
  await guest.screenshot({ path: 'artifacts/dead-drop-delete-confirm-mobile.png', fullPage: true });
  await guest.locator('#confirmDeleteButton').click();
  await dialog.waitFor({ state: 'hidden' });
  await guest.getByRole('button', { name: /Create a mission/i }).waitFor();

  // The other role is revoked on its next refresh, not only in the
  // deleting participant's session.
  await host.getByRole('button', { name: /Create a mission/i }).waitFor({ timeout: 12000 });
  await host.reload();
  await host.getByRole('button', { name: /Create a mission/i }).waitFor();
  // The server MUST respond 404 to a revoked mission, which Chromium logs
  // as a generic resource error even when the app handles it correctly.
  assert.ok(notFoundResponses.length >= 1, 'Deleting the mission should revoke a partner request');
  assert.ok(
    notFoundResponses.every(url => new URL(url).pathname === '/api/v1/missions/' + code),
    'Only the intentionally revoked API route may return HTTP 404'
  );
  assert.deepEqual(errors.filter(message => !message.includes('404 (Not Found)')), []);
});
