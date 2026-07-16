import { spawn } from 'node:child_process';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const executablePath = process.env.CHROME_BIN ??
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
const corruptBackupPath = '/tmp/lpq-corrupt-backup.json';

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

async function waitForText(page, text) {
  await page.waitForFunction((expected) => document.body.textContent?.includes(expected), {}, text);
}

async function assertNoOverflow(page, label) {
  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  if (!noOverflow) throw new Error(`${label} déborde horizontalement.`);
}

function writeCorruptBackup() {
  writeFileSync(corruptBackupPath, JSON.stringify({
    format: 'les-petites-quetes-backup',
    exportedAt: '2026-07-16T12:00:00.000Z',
    state: {
      children: [{ id: 'profil-incomplet' }],
      customQuestTemplates: [], schedules: [], occurrences: [], completions: [],
      rewardGrants: [], worldProgress: [], acknowledgedRewardGrantIds: [],
      settings: {
        schemaVersion: 2, contentVersion: '1.0.0', parentPin: '1234',
        onboardingCompleted: true, soundEnabled: true, narrationEnabled: true,
        reducedMotion: 'system', defaultValidationMode: 'parent',
        celebrationDurationSeconds: 5,
      },
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
  await clickButton(page, 'Ouvrir la forêt');
  await page.waitForSelector('[data-page="child"]');

  await clickButton(page, 'Mes quêtes');
  await page.waitForSelector('.child-quest-card');
  await page.click('.child-quest-card');
  await clickButton(page, 'Je commence');
  await clickButton(page, 'J’ai terminé');
  await waitForText(page, 'Ta demande est partie vers ton adulte');

  await clickButton(page, 'Accueil');
  await clickButton(page, 'Espace parent');
  await waitForText(page, 'Demandes de validation');
  await clickButton(page, 'Valider');
  await waitForText(page, 'Aucune demande en attente');

  await clickButton(page, 'Accueil');
  await clickButton(page, 'Espace enfant');
  await page.waitForSelector('[data-reward-celebration]');
  await clickButton(page, 'Voir dans mon monde');
  await page.waitForSelector('.world-scene');

  await clickButton(page, 'Accueil');
  await clickButton(page, 'Espace parent');
  await clickButton(page, 'Enfants');
  await page.type('input[maxlength="30"]', 'Nais');
  await clickButton(page, 'Créer le profil');
  await waitForText(page, 'Nais');

  await clickButton(page, 'Quêtes');
  await clickButton(page, 'Préparer');
  await clickLabel(page, 'Nais');
  await clickButton(page, 'Ajouter la quête');
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
  await waitForText(page, '2 profil(s)');
  await waitForText(page, '1 lumière(s)');

  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await assertNoOverflow(page, 'L’accueil tablette');
  await clickButton(page, 'Espace enfant');
  await page.waitForSelector('[data-page="child"]');
  await assertNoOverflow(page, 'L’espace enfant tablette');
  await clickButton(page, 'Accueil');

  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
  await assertNoOverflow(page, 'L’accueil bureau');
  await clickButton(page, 'Espace parent');
  await page.waitForSelector('[data-page="parent-lock"]');
  await page.type('[data-page="parent-lock"] input', '1234');
  await clickButton(page, 'Ouvrir');
  await page.waitForSelector('[data-page="parent"]');
  await assertNoOverflow(page, 'L’espace parent bureau');

  const serviceWorkerSupported = await page.evaluate(() => 'serviceWorker' in navigator);
  if (!serviceWorkerSupported) throw new Error('Le navigateur ne détecte pas le service worker.');
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.app-shell');
  await page.setOfflineMode(false);

  console.log('Smoke V1 final conforme : onboarding, famille, routines, validation, import, responsive et hors ligne.');
} finally {
  if (existsSync(corruptBackupPath)) unlinkSync(corruptBackupPath);
  if (browser) await browser.close();
  await stopPreview();
}
