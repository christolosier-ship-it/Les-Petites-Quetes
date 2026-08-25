import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findRemainingChineseStringLiterals, translateOriginToFrench } from './origin-fr-translations.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUTPUT = resolve(ROOT, 'public/games/origin/index.html');

const ORIGIN_COMMIT = '1e11bd3faee664160faa6b2e6bd440fa7304b603';
const ORIGIN_BLOB_SHA = '3d4fa219a225b048136d47d9a977c96aaf15d4e1';
const ORIGIN_URL = `https://raw.githubusercontent.com/DFarm6/origin-16bit-arpg/${ORIGIN_COMMIT}/index.html`;

function gitBlobSha(content) {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

const response = await fetch(ORIGIN_URL, { headers: { 'user-agent': 'les-petites-quetes-build' } });
if (!response.ok) throw new Error(`Impossible de récupérer Origin (${response.status} ${response.statusText})`);

const upstream = await response.text();
const actualSha = gitBlobSha(upstream);
if (actualSha !== ORIGIN_BLOB_SHA) {
  throw new Error(`Origin: empreinte source inattendue (${actualSha}, attendu ${ORIGIN_BLOB_SHA})`);
}

let localized = translateOriginToFrench(upstream);
const bridge = `
/* Les Petites Quêtes : persistance locale pour le mini-jeu embarqué. */
window.storage = window.storage ?? {
  async get(key) { return { value: window.localStorage.getItem('lpq:origin:' + key) }; },
  async set(key, value) { window.localStorage.setItem('lpq:origin:' + key, value); return { key, value }; },
};
`;
localized = localized.replace("'use strict';", "'use strict';\n" + bridge);
localized = localized.replace('<title>Origin · La Montagne du Dragon — RPG 16-bit</title>', '<title>La Montagne du Dragon · Origin</title>');

const remaining = findRemainingChineseStringLiterals(localized);
if (remaining.length > 0) {
  throw new Error(`Origin FR : ${remaining.length} chaîne(s) d'interface restent à traduire :\n` + remaining.slice(0, 120).map((value) => `  - ${value}`).join('\n'));
}

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, localized, 'utf8');
console.log(`Origin FR matérialisé : ${OUTPUT} (${Buffer.byteLength(localized)} octets)`);
