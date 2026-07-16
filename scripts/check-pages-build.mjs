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
const serviceWorker = readFileSync('dist/sw.js', 'utf8');

if (indexHtml.includes('/src/main.tsx') || indexHtml.includes('src="/src/')) {
  throw new Error('Le build Pages référence encore les sources TypeScript au lieu des fichiers compilés.');
}
if (!indexHtml.includes('/Les-Petites-Quetes/assets/')) {
  throw new Error('Le build ne contient pas le sous-chemin GitHub Pages attendu.');
}
const bundle = indexHtml.match(/<script[^>]+type="module"[^>]+src="\/Les-Petites-Quetes\/(assets\/.+\.js)"/)?.[1];
if (!bundle) throw new Error('Le bundle JavaScript compilé est introuvable dans index.html.');
if (!serviceWorker.includes(`./${bundle}`)) {
  throw new Error('Le service worker ne précache pas le bundle JavaScript courant.');
}
if (!serviceWorker.includes("event.data === 'SKIP_WAITING'")) {
  throw new Error('Le service worker ne prend pas en charge une mise à jour contrôlée.');
}
if (serviceWorker.includes("cached ?? caches.match('./index.html')")) {
  throw new Error('Le service worker ne doit pas servir index.html à la place d’un asset manquant.');
}

console.log('Artefact Pages conforme : bundles compilés, précache et mise à jour contrôlée validés.');
