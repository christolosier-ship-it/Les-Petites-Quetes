import rawCopy from '../copy/app-copy.json';

export interface AppCopy {
  readonly appName: string;
  readonly tagline: string;
  readonly welcomeTitle: string;
  readonly welcomeBody: string;
  readonly childSpaceLabel: string;
  readonly parentSpaceLabel: string;
  readonly backLabel: string;
}

const requiredKeys: readonly (keyof AppCopy)[] = [
  'appName',
  'tagline',
  'welcomeTitle',
  'welcomeBody',
  'childSpaceLabel',
  'parentSpaceLabel',
  'backLabel',
];

export function assertAppCopy(value: unknown): asserts value is AppCopy {
  if (!value || typeof value !== 'object') throw new Error('Le contenu du shell doit être un objet.');
  const record = value as Record<string, unknown>;
  for (const key of requiredKeys) {
    if (typeof record[key] !== 'string' || record[key].trim().length === 0) {
      throw new Error(`Texte obligatoire manquant : ${key}`);
    }
  }
}

assertAppCopy(rawCopy);
export const appCopy: AppCopy = rawCopy;
