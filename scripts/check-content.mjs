import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const content = JSON.parse(readFileSync(join(root, 'src/content/copy/app-copy.json'), 'utf8'));
const required = [
  'appName',
  'tagline',
  'welcomeTitle',
  'welcomeBody',
  'childSpaceLabel',
  'parentSpaceLabel',
  'backLabel',
];
const errors = [];

for (const key of required) {
  if (typeof content[key] !== 'string' || content[key].trim().length === 0) {
    errors.push(`Texte obligatoire manquant : ${key}`);
  }
}

const forbiddenPatterns = [
  /tu as échoué/i,
  /série perdue/i,
  /moins bien que/i,
  /mauvais enfant/i,
];
for (const [key, value] of Object.entries(content)) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(String(value))) errors.push(`Formulation culpabilisante détectée dans ${key}.`);
  }
}

if (errors.length > 0) {
  console.error(`Validation des contenus en échec :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`${required.length} textes obligatoires validés, sans formulation culpabilisante connue.`);
