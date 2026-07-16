import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'dist/index.html',
  'dist/manifest.webmanifest',
  'dist/sw.js',
];

const missingFiles = requiredFiles.filter((path) => !existsSync(path));
if (missingFiles.length > 0) {
  throw new Error(`Artefact de déploiement incomplet : ${missingFiles.join(', ')}`);
}

const indexHtml = readFileSync('dist/index.html', 'utf8');

if (indexHtml.includes('/src/main.tsx') || indexHtml.includes('src="/src/')) {
  throw new Error('Le build Pages référence encore les sources TypeScript au lieu des fichiers compilés.');
}

if (!indexHtml.includes('/Les-Petites-Quetes/assets/')) {
  throw new Error('Le build ne contient pas le sous-chemin GitHub Pages attendu.');
}

if (!indexHtml.match(/<script[^>]+type="module"[^>]+src="\/Les-Petites-Quetes\/assets\/.+\.js"/)) {
  throw new Error('Le bundle JavaScript compilé est introuvable dans index.html.');
}

console.log('Artefact GitHub Pages conforme : sources compilées et chemins de publication valides.');
