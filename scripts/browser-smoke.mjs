import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const executablePath = process.env.CHROME_BIN ?? ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
if (!executablePath) throw new Error('Chrome ou Chromium est requis.');

const preview = spawn(process.execPath, [join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--host', '127.0.0.1'], { stdio: 'ignore' });
const url = 'http://127.0.0.1:4173/Les-Petites-Quetes/';

async function waitForPreview() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch(url)).ok) return; } catch { /* démarrage */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('La prévisualisation ne répond pas.');
}

async function clickButton(page, text) {
  const clicked = await page.$$eval('button', (buttons, expected) => {
    const button = buttons.find((candidate) => !candidate.disabled && candidate.textContent?.includes(expected));
    if (!button) return false;
    button.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`Bouton introuvable : ${text}`);
}

async function clickLabel(page, text) {
  const clicked = await page.$$eval('label', (labels, expected) => {
    const label = labels.find((candidate) => candidate.textContent?.includes(expected));
    if (!label) return false;
    label.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`Libellé introuvable : ${text}`);
}

async function selectByLabel(page, labelText, value) {
  const selected = await page.$$eval('label', (labels, args) => {
    const select = labels.find((candidate) => candidate.textContent?.includes(args.labelText))?.querySelector('select');
    if (!select) return false;
    select.value = args.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, { labelText, value });
  if (!selected) throw new Error(`Sélecteur introuvable : ${labelText}`);
}

async function waitForText(page, text) {
  await page.waitForFunction((expected) => document.body.textContent?.includes(expected), { timeout: 15_000 }, text);
}

async function assertNoOverflow(page, label) {
  if (!(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))) throw new Error(`${label} déborde horizontalement.`);
}

async function readState(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('les-petites-quetes', 2);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const get = database.transaction('familyState', 'readonly').objectStore('familyState').get('current');
      get.onerror = () => reject(get.error);
      get.onsuccess = () => { resolve(get.result?.value); database.close(); };
    };
  }));
}

let browser;
try {
  await waitForPreview();
  browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  await clickLabel(page, 'usage familial privé');
  await clickButton(page, 'Créer le premier profil');
  await page.type('input[maxlength="30"]', 'Maddie');
  await clickButton(page, 'Continuer');
  await page.type('input[pattern="[0-9]{4}"]', '1234');
  await clickButton(page, 'Ouvrir les univers');
  await page.waitForSelector('.world-tile-grid');

  const tileCount = await page.$$eval('[data-world-tile]', (tiles) => tiles.length);
  if (tileCount !== 6) throw new Error(`Six univers attendus, ${tileCount} trouvés.`);
  if (!(await page.$('[data-world-tile="world.firefly-forest"] .world-notification'))) throw new Error('Pastille forêt absente.');
  if (await page.$('[data-world-tile="world.space-station"] .world-notification')) throw new Error('Pastille indue sur la station.');

  await page.click('[data-world-tile="world.firefly-forest"]');
  await clickButton(page, 'Mes quêtes');
  await page.click('.child-quest-card');
  await clickButton(page, 'Je commence');
  await clickButton(page, 'J’ai terminé');
  await waitForText(page, 'Ta demande est partie vers ton adulte');

  await clickButton(page, 'Accueil');
  await clickButton(page, 'Espace parent');
  await clickButton(page, 'Valider');
  await waitForText(page, 'Aucune demande en attente');

  await clickButton(page, 'Enfants');
  const profileForm = await page.$('.panel-grid form');
  if (!profileForm) throw new Error('Formulaire de profil introuvable.');
  const nameInput = await profileForm.$('input[maxlength="30"]');
  if (!nameInput) throw new Error('Champ prénom introuvable.');
  await nameInput.type('Nais');
  await selectByLabel(page, 'Tranche d’âge', '6-8');
  await clickButton(page, 'Créer le profil');
  await waitForText(page, 'Nais');

  await clickButton(page, 'Quêtes');
  await selectByLabel(page, 'Univers', 'world.dragon-mountain');
  await selectByLabel(page, 'Tranche d’âge', '3-5');
  await waitForText(page, 'L’armure du matin');
  await page.$$eval('.quest-template-card', (cards) => {
    const card = cards.find((candidate) => candidate.textContent?.includes('L’armure du matin'));
    [...(card?.querySelectorAll('button') ?? [])].find((button) => button.textContent?.includes('Préparer'))?.click();
  });
  await clickLabel(page, 'Nais');
  await clickButton(page, 'Ajouter la quête');

  const state = await readState(page);
  const variants = new Set(state.occurrences.filter((item) => item.questFamilyId === 'family.morning.dress').map((item) => item.questTemplateId));
  if (!variants.has('family.morning.dress.3-5') || !variants.has('family.morning.dress.6-8')) throw new Error('Variantes d’âge incomplètes.');

  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await assertNoOverflow(page, 'La tablette');
  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
  await assertNoOverflow(page, 'Le bureau');

  await page.evaluate(async () => navigator.serviceWorker.ready);
  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.app-shell');
  await page.setOfflineMode(false);

  console.log('Smoke V3 conforme : univers, validation, profils, variantes, responsive et hors ligne.');
} finally {
  if (browser) await browser.close();
  if (preview.exitCode === null) preview.kill('SIGTERM');
}
