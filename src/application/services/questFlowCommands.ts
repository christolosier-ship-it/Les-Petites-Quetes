import { ignoreQuestOccurrence, postponeQuestOccurrence } from '../../domain/completion/OccurrenceDisposition';
import {
  approveQuestValidation,
  requestAnotherStep,
  requestJointReview,
  requestQuestValidation,
  startQuestOccurrence,
} from '../../domain/completion/QuestValidation';
import type { QuestOccurrence } from '../../domain/completion/QuestOccurrenceTypes';
import { incrementRevision } from '../../domain/shared/entity';
import {
  createCompletion,
  createRewardGrant,
  rebuildWorldProgress,
} from '../../domain/progression/QuestProgression';
import type { ValidationMode } from '../../domain/shared/types';
import { findQuestTemplate } from '../../content/quests/builtinQuests';
import {
  allRewards,
  allStoryChapters,
  findRewardDefinition,
  findWorldDefinition,
} from '../../content/world/worldCatalog';
import type { FamilyState } from '../model/FamilyState';
import type { IdGenerator } from '../ports/IdGenerator';

function occurrenceById(state: FamilyState, occurrenceId: string): QuestOccurrence {
  const occurrence = state.occurrences.find((candidate) => candidate.id === occurrenceId);
  if (!occurrence) throw new Error('Quête introuvable.');
  return occurrence;
}

function replaceOccurrence(state: FamilyState, occurrence: QuestOccurrence): FamilyState {
  return { ...state, occurrences: state.occurrences.map((candidate) => candidate.id === occurrence.id ? occurrence : candidate) };
}

function validationModeFor(state: FamilyState, occurrence: QuestOccurrence): ValidationMode {
  const schedule = state.schedules.find((candidate) => candidate.id === occurrence.scheduleId);
  if (!schedule) throw new Error('Planification introuvable.');
  return schedule.validationMode;
}

function finalizeCompletion(
  state: FamilyState,
  occurrence: QuestOccurrence,
  mode: ValidationMode,
  validatedBy: 'child' | 'parent' | 'together',
  now: string,
  ids: IdGenerator,
): FamilyState {
  const existing = state.completions.find((completion) => completion.occurrenceId === occurrence.id && completion.deletedAt === undefined);
  if (existing) return replaceOccurrence(state, { ...occurrence, completionId: existing.id });
  const template = findQuestTemplate(occurrence.questTemplateId, state.customQuestTemplates);
  if (!template) throw new Error('Variante de quête introuvable.');
  if (template.worldId !== occurrence.worldId) throw new Error('La quête et son univers ne correspondent pas.');
  const rewardDefinition = findRewardDefinition(template.rewardDefinitionId);
  if (rewardDefinition.worldId !== occurrence.worldId) throw new Error('La récompense appartient à un autre univers.');
  const grantId = ids.next();
  const completion = createCompletion(occurrence, mode, validatedBy, grantId, { id: ids.next(), createdAt: now });
  const grant = createRewardGrant(completion, rewardDefinition, { id: grantId, createdAt: now });
  const grants = [...state.rewardGrants, grant];
  const world = findWorldDefinition(occurrence.worldId);
  const existingProgress = state.worldProgress.find((progress) => progress.childId === occurrence.childId && progress.worldId === occurrence.worldId);
  const progress = rebuildWorldProgress({
    childId: occurrence.childId,
    worldId: occurrence.worldId,
    worldVersion: world.version,
    grants,
    rewards: allRewards,
    chapters: allStoryChapters,
    ...(existingProgress !== undefined ? { existing: existingProgress } : {}),
    identity: { id: existingProgress?.id ?? ids.next(), createdAt: now },
    celebrationAt: now,
  });
  const completedOccurrence: QuestOccurrence = { ...occurrence, completionId: completion.id, ...incrementRevision(occurrence, now) };
  return {
    ...replaceOccurrence(state, completedOccurrence),
    completions: [...state.completions, completion],
    rewardGrants: grants,
    worldProgress: [...state.worldProgress.filter((candidate) => candidate.id !== progress.id), progress],
  };
}

export function startOccurrence(state: FamilyState, occurrenceId: string, now: string): FamilyState {
  return replaceOccurrence(state, startQuestOccurrence(occurrenceById(state, occurrenceId), now));
}

export function finishOccurrence(state: FamilyState, occurrenceId: string, now: string, ids: IdGenerator): FamilyState {
  const occurrence = occurrenceById(state, occurrenceId);
  const mode = validationModeFor(state, occurrence);
  const requested = requestQuestValidation(occurrence, mode, now);
  const next = replaceOccurrence(state, requested);
  return requested.status === 'completed' ? finalizeCompletion(next, requested, mode, 'child', now, ids) : next;
}

export function approveOccurrence(state: FamilyState, occurrenceId: string, now: string, ids: IdGenerator): FamilyState {
  const occurrence = occurrenceById(state, occurrenceId);
  const mode = validationModeFor(state, occurrence);
  const adultMode = mode === 'together' ? 'together' : 'parent';
  const completed = approveQuestValidation(occurrence, adultMode, now);
  return finalizeCompletion(replaceOccurrence(state, completed), completed, mode, adultMode, now, ids);
}

export function askAnotherStep(state: FamilyState, occurrenceId: string, now: string): FamilyState {
  return replaceOccurrence(state, requestAnotherStep(occurrenceById(state, occurrenceId), now));
}

export function askJointReview(state: FamilyState, occurrenceId: string, now: string): FamilyState {
  return replaceOccurrence(state, requestJointReview(occurrenceById(state, occurrenceId), now));
}

export function postponeOccurrence(state: FamilyState, occurrenceId: string, postponedTo: string, today: string, now: string): FamilyState {
  return replaceOccurrence(state, postponeQuestOccurrence(occurrenceById(state, occurrenceId), postponedTo, today, now));
}

export function ignoreOccurrence(state: FamilyState, occurrenceId: string, now: string): FamilyState {
  return replaceOccurrence(state, ignoreQuestOccurrence(occurrenceById(state, occurrenceId), now));
}
