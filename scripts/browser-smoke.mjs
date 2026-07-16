import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const executablePath =
  process.env.CHROME_BIN ??
  ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);

if (!executablePath) {
  console.error('Chrome ou Chromium est requis pour le smoke test navigateur.');
  process.exit(1);
}

const viteEntry = join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
const preview = spawn(process.execPath, [viteEntry, 'preview', '--host', '127.0.0.1'], {
  env: process.env,
  stdio: 'ignore',
});
const url = 'http://127.0.0.1:4173/Les-Petites-Quetes/';

async function waitForPreview() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Le serveur démarre encore.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Le serveur de prévisualisation ne répond pas.');
}

async function stopPreview() {
  if (preview.exitCode !== null) return;
  preview.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => preview.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ]);
  if (preview.exitCode === null) preview.kill('SIGKILL');
}

async function clickButton(page, text) {
  const clicked = await page.$$eval(
    'button',
    (buttons, expected) => {
      const button = buttons.find(
        (candidate) => !candidate.disabled && candidate.textContent?.includes(expected),
      );
      if (!button) return false;
      button.click();
      return true;
    },
    text,
  );
  if (!clicked) throw new Error(`Bouton introuvable : ${text}`);
}

async function waitForText(page, text) {
  await page.waitForFunction(
    (expected) => document.body.textContent?.includes(expected),
    {},
    text,
  );
}

let browser;
try {
  await waitForPreview();
  browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-page="welcome"]');

  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  if (!noOverflow) throw new Error('L’accueil déborde horizontalement sur mobile.');

  await clickButton(page, 'Espace parent');
  await page.waitForSelector('[data-page="parent-lock"] input');
  await page.type('[data-page="parent-lock"] input', '1234');
  await clickButton(page, 'Créer le code');
  await page.waitForSelector('[data-page="parent"]');

  await clickButton(page, 'Enfants');
  await page.waitForSelector('input[maxlength="30"]');
  await page.type('input[maxlength="30"]', 'Maddie');
  await clickButton(page, 'Créer le profil');
  await waitForText(page, 'Maddie');

  await clickButton(page, 'Quêtes');
  await page.waitForSelector('.quest-template-card');
  await clickButton(page, 'Préparer');
  await page.waitForSelector('.editor-card form');
  await clickButton(page, 'Ajouter la quête');
  await page.waitForSelector('.quest-library-grid');

  await clickButton(page, 'Accueil');
  await page.waitForSelector('[data-page="welcome"]');
  await clickButton(page, 'Espace enfant');
  await page.waitForSelector('[data-page="child"]');
  await clickButton(page, 'Mes quêtes');
  await page.waitForSelector('.child-quest-card');
  await page.click('.child-quest-card');
  await page.waitForSelector('[data-quest-detail]');
  await clickButton(page, 'Je commence');
  await page.waitForSelector('[data-action="finish-quest"]');
  await clickButton(page, 'J’ai terminé');
  await waitForText(page, 'Ta demande est partie vers ton adulte');

  await clickButton(page, 'Accueil');
  await clickButton(page, 'Espace parent');
  await page.waitForSelector('[data-page="parent"]');
  await waitForText(page, 'Demandes de validation');
  await clickButton(page, 'Valider');
  await waitForText(page, 'Aucune demande en attente');

  await clickButton(page, 'Accueil');
  await clickButton(page, 'Espace enfant');
  await page.waitForSelector('.world-scene');
  await waitForText(page, '1 petite(s) quête(s)');

  const serviceWorkerSupported = await page.evaluate(() => 'serviceWorker' in navigator);
  if (!serviceWorkerSupported) throw new Error('Le navigateur ne détecte pas le service worker.');
  await page.evaluate(async () => navigator.serviceWorker.ready);

  await page.setOfflineMode(false);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-page="welcome"]');
  await waitForText(page, '1 profil(s)');
  await waitForText(page, '1 lumière(s)');

  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.app-shell');
  await page.waitForSelector('[data-page="welcome"]');
  await page.setOfflineMode(false);

  console.log('Smoke V1 conforme : création, quête, validation, récompense, persistance et hors ligne validés.');
} finally {
  if (browser) await browser.close();
  await stopPreview();
}
