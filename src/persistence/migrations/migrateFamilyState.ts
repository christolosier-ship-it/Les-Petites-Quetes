import {
  CONTENT_VERSION,
  SCHEMA_VERSION,
  createEmptyFamilyState,
  type FamilyState,
} from '../../application/model/FamilyState';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function arrayField(source: Record<string, unknown>, key: string): readonly unknown[] {
  const value = source[key];
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`Le champ ${key} doit être une liste.`);
  return value;
}

function migrateV1(source: Record<string, unknown>): FamilyState {
  const settingsValue = source.settings;
  if (!isRecord(settingsValue)) throw new Error('Les réglages de la sauvegarde sont absents.');
  const base = createEmptyFamilyState();
  const parentPin = settingsValue.parentPin;
  const soundEnabled = settingsValue.soundEnabled;
  const narrationEnabled = settingsValue.narrationEnabled;
  const reducedMotion = settingsValue.reducedMotion;
  const defaultValidationMode = settingsValue.defaultValidationMode;
  const activeChildId = settingsValue.activeChildId;

  if (typeof parentPin !== 'string') throw new Error('Le code parent est invalide.');
  if (typeof soundEnabled !== 'boolean' || typeof narrationEnabled !== 'boolean') {
    throw new Error('Les réglages audio sont invalides.');
  }
  if (!['system', 'reduce', 'allow'].includes(String(reducedMotion))) {
    throw new Error('Le réglage des animations est invalide.');
  }
  if (!['child', 'parent', 'together'].includes(String(defaultValidationMode))) {
    throw new Error('Le mode de validation par défaut est invalide.');
  }
  if (activeChildId !== undefined && typeof activeChildId !== 'string') {
    throw new Error('Le profil actif est invalide.');
  }

  return {
    children: arrayField(source, 'children') as FamilyState['children'],
    customQuestTemplates: arrayField(source, 'customQuestTemplates') as FamilyState['customQuestTemplates'],
    schedules: arrayField(source, 'schedules') as FamilyState['schedules'],
    occurrences: arrayField(source, 'occurrences') as FamilyState['occurrences'],
    completions: arrayField(source, 'completions') as FamilyState['completions'],
    rewardGrants: arrayField(source, 'rewardGrants') as FamilyState['rewardGrants'],
    worldProgress: arrayField(source, 'worldProgress') as FamilyState['worldProgress'],
    settings: {
      ...base.settings,
      schemaVersion: SCHEMA_VERSION,
      contentVersion:
        typeof settingsValue.contentVersion === 'string'
          ? settingsValue.contentVersion
          : CONTENT_VERSION,
      parentPin,
      soundEnabled,
      narrationEnabled,
      reducedMotion: reducedMotion as FamilyState['settings']['reducedMotion'],
      defaultValidationMode:
        defaultValidationMode as FamilyState['settings']['defaultValidationMode'],
      ...(activeChildId !== undefined ? { activeChildId } : {}),
      ...(typeof settingsValue.lastBackupAt === 'string'
        ? { lastBackupAt: settingsValue.lastBackupAt }
        : {}),
    },
  };
}

export function migrateFamilyState(value: unknown): FamilyState {
  if (value === undefined || value === null) return createEmptyFamilyState();
  if (!isRecord(value)) throw new Error('La sauvegarde doit contenir un objet.');
  const settings = value.settings;
  if (!isRecord(settings)) throw new Error('La version du schéma est absente.');
  const schemaVersion = Number(settings.schemaVersion);
  if (schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Version de schéma non prise en charge : ${String(settings.schemaVersion)}.`);
  }
  return migrateV1(value);
}
