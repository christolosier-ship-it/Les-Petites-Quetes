import {
  CONTENT_VERSION,
  SCHEMA_VERSION,
  type AppSettings,
  type CelebrationDurationSeconds,
  type FamilyState,
} from '../../application/model/FamilyState';
import { builtinQuestTemplates } from '../../content/quests/builtinQuests';
import {
  FIREFLY_WORLD_ID,
  fireflyChapters,
  fireflyRewards,
} from '../../content/world/fireflyWorld';
import type { EntityMetadata } from '../../domain/shared/entity';
import { VALIDATION_MODES } from '../../domain/shared/types';
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
  text,
} from './runtimeValidation';

function hydrateSettings(value: unknown): AppSettings {
  const source = record(value, 'réglages');
  if (integer(source, 'schemaVersion', 1) !== SCHEMA_VERSION) {
    throw new Error(`Version de schéma attendue : ${SCHEMA_VERSION}.`);
  }
  const parentPinValue = source.parentPin;
  if (typeof parentPinValue !== 'string' || !/^$|^\d{4}$/.test(parentPinValue)) {
    throw new Error('Le code parent doit être vide ou contenir quatre chiffres.');
  }
  const duration = integer(source, 'celebrationDurationSeconds', 1);
  if (![3, 5, 8].includes(duration)) throw new Error('La durée de célébration est inconnue.');
  return {
    schemaVersion: SCHEMA_VERSION,
    contentVersion: typeof source.contentVersion === 'string' ? source.contentVersion : CONTENT_VERSION,
    ...(optionalText(source, 'activeChildId') !== undefined
      ? { activeChildId: optionalText(source, 'activeChildId') }
      : {}),
    parentPin: parentPinValue,
    onboardingCompleted: boolean(source, 'onboardingCompleted'),
    soundEnabled: boolean(source, 'soundEnabled'),
    narrationEnabled: boolean(source, 'narrationEnabled'),
    reducedMotion: oneOf(source, 'reducedMotion', ['system', 'reduce', 'allow'] as const),
    defaultValidationMode: oneOf(source, 'defaultValidationMode', VALIDATION_MODES),
    celebrationDurationSeconds: duration as CelebrationDurationSeconds,
    ...(optionalText(source, 'lastBackupAt') !== undefined
      ? { lastBackupAt: optionalText(source, 'lastBackupAt') }
      : {}),
  };
}

function assertReferences(state: FamilyState): void {
  const childIds = new Set(state.children.map((child) => child.id));
  const templateIds = new Set([
    ...builtinQuestTemplates.map((template) => template.id),
    ...state.customQuestTemplates.map((template) => template.id),
  ]);
  const scheduleIds = new Set(state.schedules.map((schedule) => schedule.id));
  const occurrenceIds = new Set(state.occurrences.map((occurrence) => occurrence.id));
  const completionIds = new Set(state.completions.map((completion) => completion.id));
  const grantIds = new Set(state.rewardGrants.map((grant) => grant.id));
  const rewardIds = new Set(fireflyRewards.map((reward) => reward.id));

  for (const schedule of state.schedules) {
    if (!templateIds.has(schedule.questTemplateId)) throw new Error('Une planification référence une quête inconnue.');
    if (schedule.childIds.some((id) => !childIds.has(id))) throw new Error('Une planification référence un enfant inconnu.');
  }
  const occurrenceKeys = new Set<string>();
  for (const occurrence of state.occurrences) {
    if (!scheduleIds.has(occurrence.scheduleId)) throw new Error('Une occurrence référence une planification inconnue.');
    if (!templateIds.has(occurrence.questTemplateId)) throw new Error('Une occurrence référence une quête inconnue.');
    if (!childIds.has(occurrence.childId)) throw new Error('Une occurrence référence un enfant inconnu.');
    const key = `${occurrence.scheduleId}:${occurrence.childId}:${occurrence.localDate}`;
    if (occurrenceKeys.has(key)) throw new Error('Deux occurrences partagent la même clé métier.');
    occurrenceKeys.add(key);
    if (occurrence.status === 'completed' && occurrence.completionId === undefined) {
      throw new Error('Une occurrence terminée doit référencer sa réalisation.');
    }
    if (occurrence.completionId !== undefined && !completionIds.has(occurrence.completionId)) {
      throw new Error('Une occurrence référence une réalisation inconnue.');
    }
  }
  const completedOccurrences = new Set<string>();
  for (const completion of state.completions) {
    if (!occurrenceIds.has(completion.occurrenceId) || !childIds.has(completion.childId)) {
      throw new Error('Une réalisation contient une référence inconnue.');
    }
    if (!grantIds.has(completion.rewardGrantId)) throw new Error('Une réalisation référence une récompense absente.');
    if (completedOccurrences.has(completion.occurrenceId)) throw new Error('Une occurrence possède plusieurs réalisations.');
    completedOccurrences.add(completion.occurrenceId);
  }
  const rewardedCompletions = new Set<string>();
  for (const grant of state.rewardGrants) {
    if (!completionIds.has(grant.completionId) || !childIds.has(grant.childId)) {
      throw new Error('Une récompense attribuée contient une référence inconnue.');
    }
    if (!rewardIds.has(grant.rewardDefinitionId)) throw new Error('Une récompense attribuée utilise une définition inconnue.');
    if (rewardedCompletions.has(grant.completionId)) throw new Error('Une réalisation possède plusieurs récompenses principales.');
    rewardedCompletions.add(grant.completionId);
  }
  if (state.acknowledgedRewardGrantIds.some((id) => !grantIds.has(id))) {
    throw new Error('Une célébration reconnue référence une récompense inconnue.');
  }
}

function stageForCount(count: number): 0 | 1 | 2 | 3 {
  if (count >= 12) return 3;
  if (count >= 6) return 2;
  if (count >= 2) return 1;
  return 0;
}

function assertProgress(state: FamilyState): void {
  const childIds = new Set(state.children.map((child) => child.id));
  const seenWorlds = new Set<string>();
  const rewardDefinitions = new Set(fireflyRewards.map((reward) => reward.id));
  for (const progress of state.worldProgress) {
    if (!childIds.has(progress.childId)) throw new Error('Une progression référence un enfant inconnu.');
    if (progress.worldId !== FIREFLY_WORLD_ID) throw new Error('Une progression utilise un univers inconnu.');
    const worldKey = `${progress.childId}:${progress.worldId}`;
    if (seenWorlds.has(worldKey)) throw new Error('Un enfant possède plusieurs progressions pour le même monde.');
    seenWorlds.add(worldKey);
    const grants = state.rewardGrants.filter(
      (grant) => grant.childId === progress.childId && rewardDefinitions.has(grant.rewardDefinitionId),
    );
    const expectedRewards = [...new Set(grants.map((grant) => grant.rewardDefinitionId))].sort();
    const expectedChapters = fireflyChapters
      .filter((chapter) => chapter.requiredCompletions <= grants.length)
      .map((chapter) => chapter.id)
      .sort();
    if (progress.completionCount !== grants.length || progress.stage !== stageForCount(grants.length)) {
      throw new Error('La progression enregistrée ne correspond pas aux récompenses attribuées.');
    }
    if ([...progress.unlockedRewardIds].sort().join('|') !== expectedRewards.join('|')) {
      throw new Error('Les récompenses débloquées ne correspondent pas à l’historique.');
    }
    if ([...progress.unlockedStoryChapterIds].sort().join('|') !== expectedChapters.join('|')) {
      throw new Error('Les chapitres débloqués ne correspondent pas à l’historique.');
    }
  }
}

function assertGlobalIds(groups: readonly (readonly EntityMetadata[])[]): void {
  const allIds = groups.flatMap((group) => group.map((entity) => entity.id));
  if (new Set(allIds).size !== allIds.length) {
    throw new Error('Deux entités familiales partagent le même identifiant.');
  }
}

export function validateFamilyState(value: unknown): FamilyState {
  const source = record(value, 'état familial');
  const state: FamilyState = {
    children: list(source.children, 'children').map(hydrateChild),
    customQuestTemplates: list(source.customQuestTemplates, 'customQuestTemplates').map(hydrateQuestTemplate),
    schedules: list(source.schedules, 'schedules').map(hydrateSchedule),
    occurrences: list(source.occurrences, 'occurrences').map(hydrateOccurrence),
    completions: list(source.completions, 'completions').map(hydrateCompletion),
    rewardGrants: list(source.rewardGrants, 'rewardGrants').map(hydrateRewardGrant),
    worldProgress: list(source.worldProgress, 'worldProgress').map(hydrateWorldProgress),
    acknowledgedRewardGrantIds: stringList(source, 'acknowledgedRewardGrantIds'),
    settings: hydrateSettings(source.settings),
  };
  for (const [label, items] of [
    ['children', state.children],
    ['customQuestTemplates', state.customQuestTemplates],
    ['schedules', state.schedules],
    ['occurrences', state.occurrences],
    ['completions', state.completions],
    ['rewardGrants', state.rewardGrants],
    ['worldProgress', state.worldProgress],
  ] as const) assertUniqueIds(items, label);
  assertGlobalIds([
    state.children,
    state.customQuestTemplates,
    state.schedules,
    state.occurrences,
    state.completions,
    state.rewardGrants,
    state.worldProgress,
  ]);
  if (state.customQuestTemplates.some((template) => template.source !== 'custom')) {
    throw new Error('Les données familiales ne doivent pas contenir de modèle intégré.');
  }
  if (state.settings.activeChildId !== undefined) {
    const active = state.children.find((child) => child.id === state.settings.activeChildId);
    if (!active || active.isArchived || active.deletedAt !== undefined) {
      throw new Error('Le profil actif est absent ou archivé.');
    }
  }
  if (state.settings.onboardingCompleted && (state.settings.parentPin === '' || state.children.length === 0)) {
    throw new Error('Un onboarding terminé nécessite un code parent et un profil enfant.');
  }
  assertReferences(state);
  assertProgress(state);
  return state;
}
