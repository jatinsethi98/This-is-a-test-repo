'use strict';

// End-to-end test in a real browser: an admin, four players on "phones" and
// the TV screen, all clicking through the actual UI. Needs Playwright; it is
// skipped automatically when Playwright isn't installed
// (install with:  npm install --no-save playwright && npx playwright install chromium).

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createApp } = require('../src/server');

let playwright = null;
try {
  playwright = require('playwright');
} catch {
  /* not installed */
}

const quiet = { log() {}, warn() {}, error() {}, info() {} };

test('browser: full round from join to murder through the real UI', { skip: !playwright && 'Playwright not installed', timeout: 120_000 }, async (t) => {
  const app = createApp({
    dataDir: fs.mkdtempSync(path.join(os.tmpdir(), 'traitors-e2e-')),
    adminPassword: 'e2e-pass',
    log: quiet,
  });
  const port = await app.start({ port: 0, host: '127.0.0.1' });
  const base = `http://127.0.0.1:${port}`;
  const browser = await playwright.chromium.launch();
  t.after(async () => {
    await browser.close();
    await app.stop();
  });

  const errors = [];
  async function open(url, label, mobile = true) {
    const ctx = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, hasTouch: true } : {});
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${label}: ${e.message}`));
    // 'Failed to load resource' is the browser logging an expected 4xx (wrong password, duplicate name).
    page.on('console', (m) => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errors.push(`${label} console: ${m.text()}`));
    page.on('dialog', (d) => d.accept());
    await page.goto(base + url);
    return page;
  }

  // --- Admin logs in (wrong password first)
  const admin = await open('/admin', 'admin', false);
  await admin.fill('#login-password', 'nope');
  await admin.click('#login-form button');
  await admin.locator('.toast.error').waitFor();
  await admin.fill('#login-password', 'e2e-pass');
  await admin.click('#login-form button');
  await admin.locator('#app').waitFor();
  await admin.getByText('Nobody has joined yet').waitFor();

  // --- TV screen shows a QR code to join
  const screen = await open('/screen', 'screen', false);
  await screen.locator('.qr svg').waitFor();

  // --- Four players join from their phones
  const names = ['Ann', 'Ben', 'Cat', 'Dan'];
  const phones = {};
  for (const n of names) {
    const p = await open('/', n);
    await p.fill('#join-name', n);
    await p.click('#join-form button');
    await p.getByText("You're in!").waitFor();
    phones[n] = p;
  }
  // Duplicate name is rejected with a friendly message
  const dup = await open('/', 'dup');
  await dup.fill('#join-name', 'ann');
  await dup.click('#join-form button');
  await dup.getByText('already taken').waitFor();

  await screen.getByText('4 players have joined').waitFor();
  await admin.locator('#players tbody tr').nth(3).waitFor();

  // --- Admin makes Ann the Traitor and starts
  const annRow = admin.locator('#players tr', { hasText: 'Ann' });
  await annRow.locator('select[data-change=role]').selectOption('traitor');
  await admin.locator('#players .badge.traitor').waitFor();
  await admin.click('#start-game');
  await admin.getByRole('button', { name: /Open Round Table vote/ }).waitFor();

  // Roles are hidden until tapped
  await phones.Ann.getByText('Tap to see your secret role').click();
  await phones.Ann.locator('.role-card.traitor').waitFor();
  await phones.Ben.getByText('Tap to see your secret role').click();
  await phones.Ben.locator('.role-card.faithful').waitFor();
  assert.equal(await phones.Cat.locator('.role-card').count(), 0, 'role not shown until tapped');

  // Rejoin with code on a "new device" keeps the same identity
  const benCode = (await phones.Ben.locator('#me .mono').textContent()).trim();
  const newPhone = await open('/', 'ben-new-phone');
  await newPhone.locator('details summary').click();
  await newPhone.fill('#rejoin-code', benCode);
  await newPhone.click('#rejoin-form button');
  await newPhone.getByText('Playing as').waitFor();
  assert.equal(await newPhone.locator('#me strong').first().textContent(), 'Ben');

  // --- Round Table vote
  await admin.getByRole('button', { name: /Open Round Table vote/ }).click();
  const voteFor = async (voter, target) => {
    const p = phones[voter];
    await p.getByRole('button', { name: target, exact: true }).click();
    await p.getByRole('button', { name: `Cast my vote for ${target}` }).click();
    await p.getByText(`You voted for ${target}.`).waitFor();
  };
  await voteFor('Ann', 'Ben');
  await voteFor('Ben', 'Ann');
  await voteFor('Cat', 'Ann');
  await voteFor('Dan', 'Ann');
  // "Who voted for me" (setting is on by default)
  await phones.Ann.locator('.notice', { hasText: 'Voted for you so far' }).getByText('Ben').waitFor();
  await phones.Ben.locator('.notice', { hasText: 'Voted for you so far' }).getByText('Ann').waitFor();
  await screen.getByText('4 of 4 have voted').waitFor();

  await admin.getByRole('button', { name: 'Close voting & show results' }).click();
  await phones.Cat.locator('#main').getByText('The votes are in').waitFor();
  await screen.locator('#main').getByText('The votes are in').waitFor();
  await admin.getByRole('button', { name: /Banish Ann/ }).click();
  await phones.Cat.locator('#main').getByText('Ann has been banished.').waitFor();
  await phones.Cat.locator('#main').getByText('They were a TRAITOR.').waitFor();
  await screen.locator('#main').getByText('Ann has been banished.').waitFor();

  // --- Turn "see who voted for me" off from the settings panel and check it disappears
  await admin.locator('[data-setting=showVotersToTarget]').uncheck();
  await admin.getByText('Setting saved.').waitFor();

  // Ann is out; make Ben a traitor via the admin table so night can happen
  const benRow = admin.locator('#players tr', { hasText: 'Ben' });
  await benRow.locator('select[data-change=role]').selectOption('traitor');
  await admin.locator('#status', { hasText: '1 Traitor' }).waitFor();

  // --- Night: Ben murders Dan
  await admin.getByRole('button', { name: /Start night — murder/ }).click();
  await phones.Ben.getByText("The Traitors' Tower").waitFor();
  await phones.Cat.getByText('Night has fallen').waitFor();
  await phones.Ben.getByRole('button', { name: 'Dan', exact: true }).click();
  await admin.getByText('→ Dan').waitFor();
  await admin.getByRole('button', { name: /Murder Dan/ }).click();
  await admin.getByRole('button', { name: 'Reveal to everyone' }).click();
  await phones.Dan.getByText('You were murdered').waitFor();
  await phones.Cat.locator('#main').getByText('Dan was murdered in the night.').waitFor();

  // --- Second vote: voters-for-me is hidden now
  await admin.getByRole('button', { name: /Open Round Table vote/ }).click();
  await voteFor('Cat', 'Ben');
  await phones.Cat.getByText('You voted for Ben.').waitFor();
  assert.equal(await phones.Cat.locator('.notice', { hasText: 'Voted for you' }).count(), 0);
  await phones.Ben.getByRole('button', { name: 'Cat', exact: true }).waitFor();
  assert.equal(await phones.Dan.getByText('You are not voting this round').count(), 1);

  // --- End the game
  await admin.click('#end-game');
  await phones.Cat.locator('#main').getByText('The TRAITORS win!').waitFor();
  await screen.locator('#main').getByText('The TRAITORS win!').waitFor();

  // Player reload keeps the session
  await phones.Cat.reload();
  await phones.Cat.locator('#main').getByText('The TRAITORS win!').waitFor();

  assert.deepEqual(errors, [], 'no JavaScript errors on any page');
});
