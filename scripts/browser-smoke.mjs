import { spawn } from 'node:child_process';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const executablePath = process.env.CHROME_BIN ?? ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
if (!executablePath) { console.error('Chrome ou Chromium est requis pour le smoke test navigateur.'); process.exit(1); }

const viteEntry = join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
const preview = spawn(process.execPath, [viteEntry, 'preview', '--host', '127.0.0.1'], { env: process.env, stdio: 'ignore' });
const url = 'http://127.0.0.1:4173/Les-Petites-Quetes/';
const corruptBackupPath = '/tmp/lpq-corrupt-backup-v3.json';

async function waitForPreview() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { const response = await fetch(url); if (response.ok) return; } catch { /* démarrage */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Le serveur de prévisualisation ne répond pas.');
}
async function stopPreview() {
  if (preview.exitCode !== null) return;
  preview.kill('SIGTERM');
  await Promise.race([new Promise((resolve) => preview.once('exit', resolve)), new Promise((resolve) => setTimeout(resolve, 1_000))]);
  if (preview.exitCode === null) preview.kill('SIGKILL');
}
async function clickButton(page, text) {
  const clicked = await page.$$eval('button', (buttons, expected) => {
    const button = buttons.find((candidate) => !candidate.disabled && candidate.textContent?.includes(expected));
    if (!button) return false;
    button.click(); return true;
  }, text);
  if (!clicked) throw new Error(`Bouton introuvable : ${text}`);
}
async function clickLabel(page, text) {
  const clicked = await page.$$eval('label', (labels, expected) => {
    const label = labels.find((candidate) => candidate.textContent?.includes(expected));
    if (!label) return false;
    label.click(); return true;
  }, text);
  if (!clicked) throw new Error(`Libellé introuvable : ${text}`);
}
async function selectByLabel(page, labelText, value) {
  const selected = await page.$$eval('label', (labels, args) => {
    const label = labels.find((candidate) => candidate.textContent?.includes(args.labelText));
    const select = label?.querySelector('select');
    if (!select) return false;
    select.value = args.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, { labelText, value });
  if (!selected) throw new Error(`Sélecteur introuvable : ${labelText}`);
}
async function waitForText(page, text) { await page.waitForFunction((expected) => document.body.textContent?.includes(expected), {}, text); }
async function assertNoOverflow(page, label) {
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  if (!noOverflow) throw new Error(`${label} déborde horizontalement.`);
}
async function readFamilyState(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('les-petites-quetes', 2);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('familyState', 'readonly');
      const get = transaction.objectStore('familyState').get('current');
      get.onerror = () => reject(get.error);
      get.onsuccess = () => { resolve(get.result?.value); database.close(); };
    };
  }));
}
function writeCorruptBackup() {
  writeFileSync(corruptBackupPath, JSON.stringify({
    format: 'les-petites-quetes-backup', exportedAt: '2026-07-16T12:00:00.000Z',
    state: {
      children: [{ id: 'profil-incomplet' }], customQuestTemplates: [], schedules: [], occurrences: [], completions: [], rewardGrants: [], worldProgress: [], acknowledgedRewardGrantIds: [], questTemplateIdsNeedingWorldReview: [],
      settings: { schemaVersion: 3, contentVersion: '3.0.0', parentPin: '1234', onboardingCompleted: true, soundEnabled: true, narrationEnabled: true, reducedMotion: 'system', defaultValidationMode: 'parent', celebrationDurationSeconds: 5 },
    },
  }));
}

let browser;
try {
  await waitForPreview();
  browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-page="onboarding"]');
  await assertNoOverflow(page, 'L’onboarding mobile');

  await clickLabel(page, 'usage familial privé');
  await clickButton(page, 'Créer le premier profil');
  await page.type('input[maxlength="30"]', 'Maddie');
  await clickButton(page, 'Continuer');
  await page.type('input[pattern="[0-9]{4}"]', '1234');
  await clickButton(page, 'Ouvrir les univers');
  await page.waitForSelector('[data-page="child"]');
  await page.waitForSelector('.world-tile-grid');

  const worldTileCount = await page.$$eval('[data-world-tile]', (tiles) => tiles.length);
  if (worldTileCount !== 6) throw new Error(`Le carrefour doit afficher 6 univers, pas ${worldTileCount}.`);
  const forestBadge = await page.$('[data-world-tile="world.firefly-forest"] .world-notification');
  if (!forestBadge) throw new Error('La Forêt des Lucioles devrait afficher ses quêtes disponibles.');
  const spaceBadge = await page.$('[data-world-tile="world.space-station"] .world-notification');
  if (spaceBadge) throw new Error('Une pastille est affichée sur un univers sans quête.');

  await page.click('[data-world-tile="world.firefly-forest"]');
  await page.waitForSelector('[data-world-space="world.firefly-forest"]');
  await clickButton(page, 'Mes quêtes');
  await page.waitForSelector('.child-quest-card');
  await page.click('.child-quest-card');
  await clickButton(page, 'Je commence');
  await clickButton(page, 'J’ai terminé');
  await waitForText(page, 'Ta demande est partie vers ton adulte');

  await clickButton(page, 'Accueil');
  await page.waitForSelector('.gateway-pane--child');
  await page.waitForSelector('.gateway-pane--parent');
  await clickButton(page, 'Espace parent');
  await waitForText(page, 'Demandes de validation');
  await clickButton(page, 'Valider');
  await waitForText(page, 'Aucune demande en attente');

  await clickButton(page, 'Accueil');
  await clickButton(page, 'Espace enfant');
  await page.waitForSelector('[data-reward-celebration]');
  await clickButton(page, 'Continuer');
  await page.waitForSelector('.world-tile-grid');

  await clickButton(page, 'Accueil');
  await clickButton(page, 'Espace parent');
  await clickButton(page, 'Enfants');
  const legacyProfileText = await page.evaluate(() => document.body.textContent ?? '');
  if (legacyProfileText.includes('Compagnon') || legacyProfileText.includes('Couleur')) throw new Error('Les anciens champs compagnon ou couleur sont encore visibles.');
  const newProfileForm = await page.$('.panel-grid form');
  if (!newProfileForm) throw new Error('Formulaire de profil introuvable.');
  await newProfileForm.$eval('input[maxlength="30"]', (input) => { input.value = 'Nais'; input.dispatchEvent(new Event('input', { bubbles: true })); });
  await newProfileForm.$eval('select', (select) => { select.value = '6-8'; select.dispatchEvent(new Event('change', { bubbles: true })); });
  await clickButton(page, 'Créer le profil');
  await waitForText(page, 'Nais');

  await clickButton(page, 'Quêtes');
  await selectByLabel(page, 'Univers', 'world.dragon-mountain');
  await selectByLabel(page, 'Tranche d’âge', '3-5');
  await waitForText(page, 'L’armure du matin');
  const prepared = await page.$$eval('.quest-template-card', (cards) => {
    const card = cards.find((candidate) => candidate.textContent?.includes('L’armure du matin'));
    const button = [...(card?.querySelectorAll('button') ?? [])].find((candidate) => candidate.textContent?.includes('Préparer'));
    if (!button) return false;
    button.click(); return true;
  });
  if (!prepared) throw new Error('La quête du matin ne peut pas être préparée.');
  await clickLabel(page, 'Nais');
  await clickButton(page, 'Ajouter la quête');

  const persisted = await readFamilyState(page);
  if (persisted?.settings?.schemaVersion !== 3) throw new Error('Le schéma V3 n’est pas persisté.');
  const dragonOccurrences = persisted.occurrences.filter((item) => item.questFamilyId === 'family.morning.dress' && item.worldId === 'world.dragon-mountain');
  const templateIds = new Set(dragonOccurrences.map((item) => item.questTemplateId));
  if (!templateIds.has('family.morning.dress.3-5') || !templateIds.has('family.morning.dress.6-8')) throw new Error(`Les variantes d’âge n’ont pas été générées : ${[...templateIds].join(', ')}`);

  await clickButton(page, 'Routines');
  await waitForText(page, 'Maddie, Nais');
  await clickButton(page, 'Mettre en pause');
  await clickButton(page, 'Reprendre');

  await clickButton(page, 'Réglages');
  writeCorruptBackup();
  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) throw new Error('Sélecteur de sauvegarde introuvable.');
  await fileInput.uploadFile(corruptBackupPath);
  await waitForText(page, 'Contenu détecté');
  await clickButton(page, 'Confirmer la restauration');
  await waitForText(page, 'doit être un texte non vide');

  await clickButton(page, 'Accueil');
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-page="welcome"]');
  await page.waitForSelector('.gateway-pane--child');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await assertNoOverflow(page, 'L’accueil tablette');
  await clickButton(page, 'Espace enfant');
  await page.waitForSelector('[data-page="child"]');
  await assertNoOverflow(page, 'L’espace enfant tablette');
  await page.click('[data-world-tile="world.dragon-mountain"]');
  await page.waitForSelector('[data-world-space="world.dragon-mountain"]');
  await assertNoOverflow(page, 'La Montagne du Dragon sur tablette');
  await clickButton(page, 'Accueil');

  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
  await assertNoOverflow(page, 'L’accueil bureau');
  await clickButton(page, 'Espace parent');
  await page.waitForSelector('[data-page="parent-lock"]');
  await page.type('[data-page="parent-lock"] input', '1234');
  await clickButton(page, 'Ouvrir');
  await page.waitForSelector('[data-page="parent"]');
  await assertNoOverflow(page, 'L’espace parent bureau');

  if (!(await page.evaluate(() => 'serviceWorker' in navigator))) throw new Error('Le navigateur ne détecte pas le service worker.');
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.app-shell');
  await page.setOfflineMode(false);

  console.log('Smoke V3 conforme : 6 univers, badges, variantes par âge, navigation, persistance, responsive et hors ligne.');
} finally {
  if (existsSync(corruptBackupPath)) unlinkSync(corruptBackupPath);
  if (browser) await browser.close();
  await stopPreview();
}
