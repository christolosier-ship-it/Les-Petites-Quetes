import { CONTENT_VERSION, SCHEMA_VERSION, createEmptyFamilyState, type FamilyState } from '../../application/model/FamilyState';
import { defaultAvatarForAge, isAvatarAllowedForAge } from '../../content/avatars/avatarCatalog';
import { FIREFLY_WORLD_ID } from '../../content/world/worldCatalog';
import { AGE_BANDS, type AgeBand } from '../../domain/shared/types';
import { list, record } from '../schemas/runtimeValidation';
import { validateFamilyState } from '../schemas/validateFamilyState';

export function inspectSchemaVersion(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const source = record(value, 'état familial');
  const settings = record(source.settings, 'réglages');
  const version = settings.schemaVersion;
  if (!Number.isInteger(version) || Number(version) < 1) throw new Error('La version du schéma est absente ou invalide.');
  return Number(version);
}
function rewardGrantIds(value: unknown): readonly string[] {
  return list(value, 'rewardGrants').map((item, index) => {
    const source = record(item, `rewardGrants[${index}]`);
    if (typeof source.id !== 'string' || source.id.trim().length === 0) throw new Error(`rewardGrants[${index}].id est invalide.`);
    return source.id;
  });
}
function migrateV1ToV2(value: unknown): unknown {
  const source = record(value, 'état familial V1');
  const settings = record(source.settings, 'réglages V1');
  const children = list(source.children, 'children');
  const parentPin = typeof settings.parentPin === 'string' ? settings.parentPin : '';
  return { ...source, acknowledgedRewardGrantIds: rewardGrantIds(source.rewardGrants), settings: { ...settings, schemaVersion: 2, onboardingCompleted: /^\d{4}$/.test(parentPin) && children.length > 0, celebrationDurationSeconds: 5 } };
}
function ageBandFrom(source: Record<string, unknown>): AgeBand {
  const value = source.ageBand;
  return typeof value === 'string' && AGE_BANDS.includes(value as AgeBand) ? value as AgeBand : '3-5';
}
function migrateV2ToV3(value: unknown): unknown {
  const source = record(value, 'état familial V2');
  const settings = record(source.settings, 'réglages V2');
  const children = list(source.children, 'children').map((item) => {
    const child = record(item, 'profil V2');
    const ageBand = ageBandFrom(child);
    const currentAvatar = typeof child.avatarId === 'string' ? child.avatarId : '';
    const { accentId, activeWorldId, ...rest } = child;
    void accentId; void activeWorldId;
    return { ...rest, ageBand, avatarId: isAvatarAllowedForAge(currentAvatar, ageBand) ? currentAvatar : defaultAvatarForAge(ageBand) };
  });
  const customQuestTemplates: Record<string, unknown>[] = list(source.customQuestTemplates, 'customQuestTemplates').map((item) => {
    const template = record(item, 'modèle personnalisé V2');
    return { ...template, familyId: template.id, worldId: FIREFLY_WORLD_ID };
  });
  const schedules = list(source.schedules, 'schedules').map((item) => { const schedule = record(item, 'planification V2'); return { ...schedule, questFamilyId: schedule.questTemplateId, worldId: FIREFLY_WORLD_ID }; });
  const occurrences = list(source.occurrences, 'occurrences').map((item) => { const occurrence = record(item, 'occurrence V2'); return { ...occurrence, questFamilyId: occurrence.questTemplateId, worldId: FIREFLY_WORLD_ID }; });
  const customIds = customQuestTemplates.map((template) => template.id).filter((id): id is string => typeof id === 'string');
  return { ...source, children, customQuestTemplates, schedules, occurrences, questTemplateIdsNeedingWorldReview: customIds, settings: { ...settings, schemaVersion: SCHEMA_VERSION, contentVersion: CONTENT_VERSION } };
}
export function migrateFamilyState(value: unknown): FamilyState {
  if (value === undefined || value === null) return validateFamilyState(createEmptyFamilyState());
  const version = inspectSchemaVersion(value);
  if (version === SCHEMA_VERSION) return validateFamilyState(value);
  if (version === 2) return validateFamilyState(migrateV2ToV3(value));
  if (version === 1) return validateFamilyState(migrateV2ToV3(migrateV1ToV2(value)));
  throw new Error(`Version de schéma non prise en charge : ${String(version)}.`);
}
