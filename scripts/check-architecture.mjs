import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const root = process.cwd();
const sourceRoot = join(root, 'src');
const errors = [];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function report(file, rule) {
  errors.push(`${relative(root, file)} : ${rule}`);
}

function featureName(path) {
  return path.split('/features/')[1]?.split('/')[0];
}

for (const file of walk(sourceRoot).filter((path) => /\.(ts|tsx)$/.test(path))) {
  const normalized = file.split(sep).join('/');
  const content = readFileSync(file, 'utf8');
  const isTest = /\.test\.(ts|tsx)$/.test(file);

  if (normalized.includes('/domain/') && !isTest) {
    if (/from\s+['"][^'"]*(react|persistence|platform)/.test(content)) {
      report(file, 'le domaine ne peut dépendre de React, persistence ou platform');
    }
    if (/\b(indexedDB|localStorage|sessionStorage|document|window)\b/.test(content)) {
      report(file, 'le domaine ne peut utiliser les API du navigateur');
    }
    if (/new\s+Date\s*\(/.test(content)) {
      report(file, 'le domaine doit recevoir le temps par un port Clock');
    }
  }

  if ((normalized.includes('/pages/') || normalized.includes('/components/') || normalized.includes('/features/')) && !isTest) {
    if (/\b(indexedDB|localStorage|sessionStorage)\b/.test(content)) {
      report(file, 'l’interface ne peut accéder directement au stockage');
    }
    if (/from\s+['"][^'"]*persistence/.test(content)) {
      report(file, 'l’interface ne peut importer persistence');
    }
  }

  const currentFeature = featureName(normalized);
  if (currentFeature && !isTest) {
    for (const match of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (!specifier?.startsWith('.')) continue;
      const target = resolve(dirname(file), specifier).split(sep).join('/');
      const targetFeature = featureName(target);
      if (targetFeature && targetFeature !== currentFeature) {
        report(file, `une feature ne peut importer les internes de ${targetFeature}`);
      }
    }
  }

  if (!isTest && /(:\s*any\b|as\s+any\b|<any>)/.test(content)) {
    report(file, 'any est interdit sans décision documentée');
  }

  if (!normalized.includes('/assets/registry/') && /['"]\/?(icons|illustrations|mascots|rewards)\//.test(content)) {
    report(file, 'les chemins d’assets doivent passer par le registre typé');
  }
}

if (errors.length > 0) {
  console.error(`Contrôle d’architecture en échec :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log('Architecture conforme : domaine, interface, features, stockage, types et assets contrôlés.');
