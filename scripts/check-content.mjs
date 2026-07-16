import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const appCopy = JSON.parse(readFileSync(join(root, 'src/content/copy/app-copy.json'), 'utf8'));
const quests = JSON.parse(readFileSync(join(root, 'src/content/quests/builtin-quests.json'), 'utf8'));
const assets = JSON.parse(readFileSync(join(root, 'src/assets/registry/assets.json'), 'utf8'));
const requiredCopy = [
  'appName', 'tagline', 'welcomeTitle', 'welcomeBody',
  'childSpaceLabel', 'parentSpaceLabel', 'backLabel',
];
const categories = new Set([
  'autonomy', 'hygiene-routine', 'family-help', 'creativity',
  'discovery', 'wellbeing', 'kindness', 'special-adventure',
]);
const ageBands = new Set(['3-5', '6-8', '9-10']);
const readingLevels = new Set(['visual', 'short-text', 'independent']);
const validationModes = new Set(['child', 'parent', 'together']);
const rewardIds = new Set([
  'reward.lantern', 'reward.map', 'reward.mushroom', 'reward.feather',
  'reward.bench', 'reward.firefly', 'reward.flower', 'reward.star',
  'reward.fox', 'reward.hedgehog', 'reward.book', 'reward.owl',
]);
const assetIds = new Set(assets.map((asset) => asset.id));
const errors = [];
const questIds = new Set();
const forbiddenPatterns = [
  /tu as échoué/i, /série perdue/i, /moins bien que/i, /mauvais enfant/i,
  /paresseu/i, /désobéissant/i, /dépêche-toi/i,
];

function words(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function scanForbidden(value, location) {
  if (typeof value === 'string') {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(value)) errors.push(`Formulation culpabilisante détectée dans ${location}.`);
    }
    return;
  }
  if (Array.isArray(value)) value.forEach((item, index) => scanForbidden(item, `${location}[${index}]`));
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) scanForbidden(child, `${location}.${key}`);
  }
}

for (const key of requiredCopy) {
  if (typeof appCopy[key] !== 'string' || appCopy[key].trim().length === 0) {
    errors.push(`Texte obligatoire manquant : ${key}`);
  }
}

if (!Array.isArray(quests) || quests.length < 40) {
  errors.push(`La bibliothèque doit contenir au moins 40 quêtes (${quests.length ?? 0}).`);
} else {
  for (const [index, quest] of quests.entries()) {
    const location = `quête ${index + 1}`;
    if (typeof quest.id !== 'string' || quest.id.trim() === '' || questIds.has(quest.id)) {
      errors.push(`Identifiant absent ou dupliqué dans ${location}.`);
    }
    questIds.add(quest.id);
    const titleWords = words(quest.title);
    const instructionWords = words(quest.instruction);
    if (typeof quest.title !== 'string' || titleWords < 2 || titleWords > 8) {
      errors.push(`Titre invalide pour ${quest.id ?? location}.`);
    }
    if (typeof quest.instruction !== 'string' || instructionWords < 3 || instructionWords > 30) {
      errors.push(`Consigne invalide pour ${quest.id ?? location}.`);
    }
    if (Array.isArray(quest.ageBands) && quest.ageBands.includes('3-5')) {
      if (titleWords > 5 || instructionWords < 4 || instructionWords > 12) {
        errors.push(`Texte non adapté aux 3 à 5 ans pour ${quest.id}.`);
      }
    }
    if (!categories.has(quest.categoryId)) errors.push(`Catégorie inconnue pour ${quest.id}.`);
    if (!assetIds.has(quest.illustrationId)) errors.push(`Illustration inconnue pour ${quest.id}.`);
    if (!Array.isArray(quest.ageBands) || quest.ageBands.length === 0 || quest.ageBands.some((age) => !ageBands.has(age))) {
      errors.push(`Tranches d’âge invalides pour ${quest.id}.`);
    }
    if (!readingLevels.has(quest.readingLevel)) errors.push(`Niveau de lecture inconnu pour ${quest.id}.`);
    if (!validationModes.has(quest.defaultValidation)) errors.push(`Validation inconnue pour ${quest.id}.`);
    if (typeof quest.requiresAdultHelp !== 'boolean') errors.push(`Marqueur d’aide adulte absent pour ${quest.id}.`);
    if (!Number.isInteger(quest.estimatedMinutes) || quest.estimatedMinutes <= 0) {
      errors.push(`Durée indicative invalide pour ${quest.id}.`);
    }
    if (!rewardIds.has(quest.rewardDefinitionId)) {
      errors.push(`Récompense inconnue pour ${quest.id}.`);
    }
  }
}

scanForbidden(appCopy, 'app-copy');
scanForbidden(quests, 'bibliothèque');

if (errors.length > 0) {
  console.error(`Validation des contenus en échec :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`${requiredCopy.length} textes et ${quests.length} quêtes validés, y compris âges et récompenses.`);
