import {
  SCHEMA_VERSION,
  createEmptyFamilyState,
  type FamilyState,
} from '../../application/model/FamilyState';
import { validateFamilyState } from '../schemas/validateFamilyState';
import { list, record } from '../schemas/runtimeValidation';

export function inspectSchemaVersion(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const source = record(value, 'état familial');
  const settings = record(source.settings, 'réglages');
  const version = settings.schemaVersion;
  if (!Number.isInteger(version) || Number(version) < 1) {
    throw new Error('La version du schéma est absente ou invalide.');
  }
  return Number(version);
}

function rewardGrantIds(value: unknown): readonly string[] {
  return list(value, 'rewardGrants').map((item, index) => {
    const source = record(item, `rewardGrants[${index}]`);
    if (typeof source.id !== 'string' || source.id.trim().length === 0) {
      throw new Error(`rewardGrants[${index}].id est invalide.`);
    }
    return source.id;
  });
}

function migrateV1ToV2(value: unknown): unknown {
  const source = record(value, 'état familial V1');
  const settings = record(source.settings, 'réglages V1');
  const children = list(source.children, 'children');
  const parentPin = typeof settings.parentPin === 'string' ? settings.parentPin : '';
  return {
    ...source,
    acknowledgedRewardGrantIds: rewardGrantIds(source.rewardGrants),
    settings: {
      ...settings,
      schemaVersion: SCHEMA_VERSION,
      onboardingCompleted: /^\d{4}$/.test(parentPin) && children.length > 0,
      celebrationDurationSeconds: 5,
    },
  };
}

export function migrateFamilyState(value: unknown): FamilyState {
  if (value === undefined || value === null) return validateFamilyState(createEmptyFamilyState());
  const version = inspectSchemaVersion(value);
  if (version === SCHEMA_VERSION) return validateFamilyState(value);
  if (version === 1) return validateFamilyState(migrateV1ToV2(value));
  throw new Error(`Version de schéma non prise en charge : ${String(version)}.`);
}
