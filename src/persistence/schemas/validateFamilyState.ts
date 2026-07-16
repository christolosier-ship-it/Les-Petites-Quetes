import {
  CONTENT_VERSION,
  SCHEMA_VERSION,
  type AppSettings,
  type FamilyState,
} from '../../application/model/FamilyState';
import { isAvatarAllowedForAge } from '../../content/avatars/avatarCatalog';
import { VALIDATION_MODES } from '../../domain/shared/types';
import { assertFamilyReferences } from './familyReferences';
import {
  hydrateChild,
  hydrateCompletion,
  hydrateOccurrence,
  hydrateQuestTemplate,
  hydrateRewardGrant,
  hydrateSchedule,
  hydrateWorldProgress,
} from './hydrateEntities';
import {
  assertUniqueIds,
  boolean,
  integer,
  list,
  oneOf,
  optionalText,
  record,
  stringList,
} from './runtimeValidation';
import { assertWorldProgress } from './worldProgressValidation';

function celebrationDuration(source: Record<string, unknown>): 3 | 5 | 8 {
  const duration = integer(source, 'celebrationDurationSeconds', 1);
  if (duration === 3 || duration === 5 || duration === 8) return duration;
  throw new Error('La durée de célébration est inconnue.');
}

function hydrateSettings(value: unknown): AppSettings {
  const source = record(value, 'réglages');
  if (integer(source, 'schemaVersion', 1) !== SCHEMA_VERSION) throw new Error(`Version de schéma attendue : ${SCHEMA_VERSION}.`);
  const parentPin = source.parentPin;
  if (typeof parentPin !== 'string' || !/^$|^\d{4}$/.test(parentPin)) throw new Error('Le code parent doit être vide ou contenir quatre chiffres.');
  const activeChildId = optionalText(source, 'activeChildId');
  const lastBackupAt = optionalText(source, 'lastBackupAt');
  return {
    schemaVersion: SCHEMA_VERSION,
    contentVersion: typeof source.contentVersion === 'string' ? source.contentVersion : CONTENT_VERSION,
    ...(activeChildId !== undefined ? { activeChildId } : {}),
    parentPin,
    onboardingCompleted: boolean(source, 'onboardingCompleted'),
    soundEnabled: boolean(source, 'soundEnabled'),
    narrationEnabled: boolean(source, 'narrationEnabled'),
    reducedMotion: oneOf(source, 'reducedMotion', ['system', 'reduce', 'allow'] as const),
    defaultValidationMode: oneOf(source, 'defaultValidationMode', VALIDATION_MODES),
    celebrationDurationSeconds: celebrationDuration(source),
    ...(lastBackupAt !== undefined ? { lastBackupAt } : {}),
  };
}

function hydrateState(value: unknown): FamilyState {
  const source = record(value, 'état familial');
  return {
    children: list(source.children, 'children').map(hydrateChild),
    customQuestTemplates: list(source.customQuestTemplates, 'customQuestTemplates').map(hydrateQuestTemplate),
    schedules: list(source.schedules, 'schedules').map(hydrateSchedule),
    occurrences: list(source.occurrences, 'occurrences').map(hydrateOccurrence),
    completions: list(source.completions, 'completions').map(hydrateCompletion),
    rewardGrants: list(source.rewardGrants, 'rewardGrants').map(hydrateRewardGrant),
    worldProgress: list(source.worldProgress, 'worldProgress').map(hydrateWorldProgress),
    acknowledgedRewardGrantIds: stringList(source, 'acknowledgedRewardGrantIds'),
    questTemplateIdsNeedingWorldReview: stringList(source, 'questTemplateIdsNeedingWorldReview'),
    settings: hydrateSettings(source.settings),
  };
}

function assertCollectionIds(state: FamilyState): void {
  assertUniqueIds(state.children, 'children');
  assertUniqueIds(state.customQuestTemplates, 'customQuestTemplates');
  assertUniqueIds(state.schedules, 'schedules');
  assertUniqueIds(state.occurrences, 'occurrences');
  assertUniqueIds(state.completions, 'completions');
  assertUniqueIds(state.rewardGrants, 'rewardGrants');
  assertUniqueIds(state.worldProgress, 'worldProgress');
}

function assertFamilySettings(state: FamilyState): void {
  if (state.customQuestTemplates.some((template) => template.source !== 'custom')) throw new Error('Les données familiales ne doivent pas contenir de modèle intégré.');
  if (state.children.some((child) => !isAvatarAllowedForAge(child.avatarId, child.ageBand))) throw new Error('Un avatar ne correspond pas à la tranche d’âge du profil.');
  const customIds = new Set(state.customQuestTemplates.map((template) => template.id));
  if (state.questTemplateIdsNeedingWorldReview.some((id) => !customIds.has(id))) throw new Error('Une quête à vérifier est absente des modèles familiaux.');
  if (state.settings.activeChildId !== undefined) {
    const active = state.children.find((child) => child.id === state.settings.activeChildId);
    if (active === undefined || active.isArchived || active.deletedAt !== undefined) throw new Error('Le profil actif est absent ou archivé.');
  }
  if (state.settings.onboardingCompleted && (state.settings.parentPin === '' || state.children.length === 0)) throw new Error('Un onboarding terminé nécessite un code parent et un profil enfant.');
}

export function validateFamilyState(value: unknown): FamilyState {
  const state = hydrateState(value);
  assertCollectionIds(state);
  assertFamilySettings(state);
  assertFamilyReferences(state);
  assertWorldProgress(state);
  return state;
}
