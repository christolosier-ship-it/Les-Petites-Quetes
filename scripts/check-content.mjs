import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const appCopy = JSON.parse(readFileSync(join(root, 'src/content/copy/app-copy.json'), 'utf8'));
const assets = JSON.parse(readFileSync(join(root, 'src/assets/registry/assets.json'), 'utf8'));
const familyDir = join(root, 'src/content/quests/families');
const familySources = readdirSync(familyDir).filter((name) => name.endsWith('.ts')).map((name) => readFileSync(join(familyDir, name), 'utf8'));
const worldSource = readFileSync(join(root, 'src/content/world/worldCatalog.ts'), 'utf8');
const requiredCopy = ['appName', 'tagline', 'welcomeTitle', 'welcomeBody', 'childSpaceLabel', 'parentSpaceLabel', 'backLabel'];
const worldIds = ['world.firefly-forest', 'world.dragon-mountain', 'world.space-station', 'world.gnome-village', 'world.nature-discovery', 'world.creativity-workshop'];
const assetIds = new Set(assets.map((asset) => asset.id));
const errors = [];
const forbiddenPatterns = [/tu as échoué/i, /série perdue/i, /moins bien que/i, /mauvais enfant/i, /paresseu/i, /désobéissant/i, /dépêche-toi/i];

function scanForbidden(value, location) {
  for (const pattern of forbiddenPatterns) if (pattern.test(value)) errors.push(`Formulation culpabilisante détectée dans ${location}.`);
}

for (const key of requiredCopy) {
  if (typeof appCopy[key] !== 'string' || appCopy[key].trim().length === 0) errors.push(`Texte obligatoire manquant : ${key}`);
}

const familyIds = [];
const illustrationIds = [];
const rewardIds = [];
const familyWorlds = [];
for (const [index, source] of familySources.entries()) {
  scanForbidden(source, `fichier de familles ${index + 1}`);
  familyIds.push(...[...source.matchAll(/id:\s*'(family\.[^']+)'/g)].map((match) => match[1]));
  illustrationIds.push(...[...source.matchAll(/illustrationId:\s*'([^']+)'/g)].map((match) => match[1]));
  rewardIds.push(...[...source.matchAll(/rewardDefinitionId:\s*'([^']+)'/g)].map((match) => match[1]));
  familyWorlds.push(...[...source.matchAll(/worldId:\s*([A-Z_]+_WORLD_ID)/g)].map((match) => match[1]));
  const variant35 = (source.match(/'3-5':\s*\{/g) ?? []).length;
  const variant68 = (source.match(/'6-8':\s*\{/g) ?? []).length;
  const variant910 = (source.match(/'9-10':\s*\{/g) ?? []).length;
  if (variant35 !== variant68 || variant35 !== variant910) errors.push(`Variantes d’âge incomplètes dans ${index + 1}.`);
}

if (familyIds.length !== 30) errors.push(`Le catalogue doit contenir 30 familles (${familyIds.length}).`);
if (new Set(familyIds).size !== familyIds.length) errors.push('Des identifiants de familles sont dupliqués.');
if (familyWorlds.length !== 30) errors.push('Chaque famille doit référencer un univers.');
if (familyIds.length * 3 !== 90) errors.push('Le catalogue doit produire 90 variantes d’âge.');
for (const id of illustrationIds) if (!assetIds.has(id)) errors.push(`Illustration inconnue : ${id}`);
for (const id of rewardIds) {
  const explicitDefinition = worldSource.includes(`id: '${id}'`) || worldSource.includes(`id: "${id}"`);
  const generatedDefinition = assetIds.has(id);
  if (!explicitDefinition && !generatedDefinition) errors.push(`Récompense inconnue : ${id}`);
}
for (const worldId of worldIds) {
  if (!worldSource.includes(`'${worldId}'`)) errors.push(`Univers absent du catalogue : ${worldId}`);
  for (let stage = 0; stage < 4; stage += 1) {
    if (!assetIds.has(`world.${worldId.slice(6)}-stage-${stage}`)) errors.push(`État de monde absent : ${worldId}, niveau ${stage}`);
  }
}
for (const age of ['3-5', '6-8', '9-10']) {
  for (const presentation of ['girl', 'boy']) {
    if (!assetIds.has(`avatar.${presentation}.${age}`)) errors.push(`Avatar absent : ${presentation} ${age}`);
  }
}

if (errors.length > 0) {
  console.error(`Validation des contenus en échec :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`${requiredCopy.length} textes, 6 univers, 30 familles et 90 variantes validés.`);
