import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { finalizeOriginFrench } from './origin-fr-finalize.mjs';
import { translateOriginToFrench } from './origin-fr-translations.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SOURCE = resolve(ROOT, 'vendor/origin/index.html');
const OUTPUT = resolve(ROOT, 'public/games/origin/index.html');

const ORIGIN_COMMIT = '1e11bd3faee664160faa6b2e6bd440fa7304b603';
const ORIGIN_BLOB_SHA = '3d4fa219a225b048136d47d9a977c96aaf15d4e1';
const HAN = /[\u3400-\u9fff]/;

const EXTRA_REPLACEMENTS = [
  ['（+${q.gold}金 +${q.xp}XP）', '(+${q.gold} pièces +${q.xp} XP)'],
  ['`Lv.${skillRank(key)}/5 · Mana ${sk.mp} Rech. ${sk.cd}s · ${skillMeta(key).bname}系`', '`Niv.${skillRank(key)}/5 · Mana ${sk.mp} · Rech. ${sk.cd}s · ${skillMeta(key).bname}`'],
  ['`「${skillMeta(key).bname}」系 第${skillMeta(key).tier + 1}阶 · Lv.${skillRank(key)}/5`', '`« ${skillMeta(key).bname} » · palier ${skillMeta(key).tier + 1} · niv.${skillRank(key)}/5`'],
  ['`前往${ZONE_DEFS[q.zone].name} et vaincre le boss`', '`Aller à ${ZONE_DEFS[q.zone].name} et vaincre le boss`'],
  ['`击败 ${BOSS_DEFS[q.target].name}`', '`Vaincre ${BOSS_DEFS[q.target].name}`'],
  ['`Victoires ${q.need} 只魔物`', '`Vaincre ${q.need} monstres`'],
  ['`${en.price} 金`', '`${en.price} pièces`'],
  ['`击败${BOSS_DEFS[zd.req].name}`', '`Vaincre ${BOSS_DEFS[zd.req].name}`'],
  ['`Choisir un personnage（${nChars} 个）`', '`Choisir un personnage (${nChars})`'],
  ['`（持有 ◆${P.gold}）`', '`(vous avez ◆${P.gold})`'],
  ['`Reforger（${cost} 金）`', '`Reforger (${cost} pièces)`'],
  ['`Entièrement soigné !（-${cost} 金）`', '`Entièrement soigné ! (-${cost} pièces)`'],
  ['`Réinitialiser（${respecCost}金 · rend ${Math.max(0, spentAttr)}点）`', '`Réinitialiser (${respecCost} pièces · rend ${Math.max(0, spentAttr)} points)`'],
  ['`Points de talent ×${P.sp} · 按K强化`', '`Points de talent ×${P.sp} · K pour améliorer`'],
  ['`进入第 ${G.ng + 2} aventure（更强敌人）`', '`Démarrer l’aventure ${G.ng + 2} (ennemis plus forts)`'],
  ['Rend 45 % de vie（Q 使用）', 'Rend 45 % de vie (touche 1)'],
  ['Rend 60 % de mana（F 使用）', 'Rend 60 % de mana (touche 2)'],
  ['仓库 (${store.length}/${VAULT_CAP})', 'Coffre (${store.length}/${VAULT_CAP})'],
  ['法力不足', 'Mana insuffisant'],
  ['获得装备！按 I 打开Sac，悬停可与Équipé对比，点击装备/卸下', 'Équipement obtenu ! I ouvre le sac ; touchez pour équiper ou retirer'],
  ['`${sk.name} · 「${m.bname}」系`', '`${sk.name} · ${m.bname}`'],
  ['`Vendu : ${it.name}（+${v} 金）`', '`Vendu : ${it.name} (+${v} pièces)`'],
  ['`已Réinitialiser，rend  ${spent} 属性点（-${cost} 金）`', '`Réinitialisé : ${spent} points rendus (-${cost} pièces)`'],
  ['`第 ${G.ng + 1} aventure · Lv.${G.player.lvl} · 总Victoires ${G.kills}`', '`Aventure ${G.ng + 1} · Niv.${G.player.lvl} · Victoires ${G.kills}`'],
  ['`难度提升：${diffName(G.ng)}！`', '`Difficulté augmentée : ${diffName(G.ng)} !`'],
  ['（效果+', '(effet +'],
  ['）', ')'], ['（', '('], [' 金', ' pièces'], ['金 ', 'pièces '], ['金', 'pièces'],
  [' 属性点', " points d'attribut"], ['属性点', "points d'attribut"], ['点）', ' points)'], ['点', ' points'],
  ['按K强化', 'K pour améliorer'], ['系 第', ' · palier '], ['系', ''], ['阶', ''],
  ['进入第 ', 'Démarrer aventure '], ['更强敌人', 'ennemis plus forts'], [' 个', ''], ['持有', 'vous avez'],
  ['法力不足', 'Mana insuffisant'], ['获得装备', 'Équipement obtenu'], ['总Victoires', 'Victoires'], ['难度提升', 'Difficulté augmentée'],
];

function gitBlobSha(content) {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function normalizeFrenchApostrophes(source) {
  return source.replace(/(?<=[A-Za-zÀ-ÖØ-öø-ÿ])'(?=[A-Za-zÀ-ÖØ-öø-ÿ])/g, '’');
}

function extractExecutableScript(source) {
  const match = source.match(/<script>([\s\S]*?)<\/script>/);
  if (!match) throw new Error('Origin : script principal introuvable dans le HTML généré');
  return match[1];
}

function assertValidJavaScript(source) {
  const script = extractExecutableScript(source);
  try {
    // Parse uniquement. Le corps n’est jamais exécuté par le matérialiseur.
    new Function(script);
  } catch (error) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    throw new Error(`Origin : JavaScript généré invalide après traduction (${detail})`, { cause: error });
  }
}

function remainingFrenchGaps(source) {
  const withoutComments = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  return withoutComments.split('\n')
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter(({ text }) => HAN.test(text))
    .map(({ line, text }) => `L${line}: ${text.slice(0, 260)}`);
}

const upstream = await readFile(SOURCE, 'utf8');
const actualSha = gitBlobSha(upstream);
if (actualSha !== ORIGIN_BLOB_SHA) throw new Error(`Origin (${ORIGIN_COMMIT}) : empreinte source vendored inattendue (${actualSha}, attendu ${ORIGIN_BLOB_SHA})`);

let localized = translateOriginToFrench(upstream);
for (const [from, to] of [...EXTRA_REPLACEMENTS].sort((a, b) => b[0].length - a[0].length)) localized = localized.replaceAll(from, to);
localized = finalizeOriginFrench(localized);
localized = normalizeFrenchApostrophes(localized);

const bridge = `
/* Les Petites Quêtes : persistance locale pour le mini-jeu embarqué. */
window.storage = window.storage ?? {
  async get(key) { return { value: window.localStorage.getItem('lpq:origin:' + key) }; },
  async set(key, value) { window.localStorage.setItem('lpq:origin:' + key, value); return { key, value }; },
};
`;
localized = localized.replace("'use strict';", "'use strict';\n" + bridge);
localized = localized.replace('<title>Origin · La Montagne du Dragon — RPG 16-bit</title>', '<title>La Montagne du Dragon · Origin</title>');

const remaining = remainingFrenchGaps(localized);
if (remaining.length > 0) throw new Error(`Origin FR : ${remaining.length} ligne(s) contiennent encore du chinois :\n` + remaining.slice(0, 120).map((value) => `  - ${value}`).join('\n'));
assertValidJavaScript(localized);

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, localized, 'utf8');
console.log(`Origin FR matérialisé et JavaScript validé : ${OUTPUT} (${Buffer.byteLength(localized)} octets)`);
