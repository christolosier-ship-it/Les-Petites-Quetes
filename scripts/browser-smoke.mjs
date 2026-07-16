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
  await page.waitForSelector('.app-shell');

  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  if (!noOverflow) throw new Error('Le shell déborde horizontalement sur mobile.');

  await page.click('button.button--primary');
  await page.waitForSelector('[data-page="child"]');
  await page.click('[data-page="child"] button');
  await page.waitForSelector('[data-page="welcome"]');

  const buttons = await page.$$('button');
  if (buttons.length < 2) throw new Error('Les deux accès enfant et parent sont absents.');
  await buttons[1].click();
  await page.waitForSelector('[data-page="parent"]');

  const serviceWorkerSupported = await page.evaluate(() => 'serviceWorker' in navigator);
  if (!serviceWorkerSupported) throw new Error('Le navigateur ne détecte pas le support du service worker.');

  console.log('Smoke navigateur conforme : shell, mobile et navigation enfant/parent validés.');
} finally {
  if (browser) await browser.close();
  await stopPreview();
}
