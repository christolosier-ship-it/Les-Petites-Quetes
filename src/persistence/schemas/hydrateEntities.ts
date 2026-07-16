import {
  createChildProfile,
  type ChildProfile,
} from '../../domain/child/ChildProfile';
import type {
  QuestOccurrence,
  QuestOccurrenceStatus,
} from '../../domain/completion/QuestOccurrenceTypes';
import type {
  Completion,
  RewardGrant,
  WorldProgress,
} from '../../domain/progression/ProgressionTypes';
import {
  createBuiltinQuestTemplate,
  createCustomQuestTemplate,
  type QuestStep,
  type QuestTemplate,
  type QuestTemplateInput,
} from '../../domain/quest/QuestTemplate';
import {
  createQuestSchedule,
  type QuestSchedule,
  type QuestScheduleInput,
} from '../../domain/schedule/QuestSchedule';
import { normalizeLocalDate } from '../../domain/shared/localDate';
import {
  AGE_BANDS,
  DAY_MOMENTS,
  QUEST_CATEGORIES,
  READING_LEVELS,
  VALIDATION_MODES,
  WEEKDAYS,
  type AgeBand,
  type ValidationFeedback,
  type Weekday,
} from '../../domain/shared/types';
import {
  boolean,
  integer,
  list,
  metadata,
  oneOf,
  optionalInteger,
  optionalText,
  record,
  stringList,
  text,
} from './runtimeValidation';

const OCCURRENCE_STATUSES: readonly QuestOccurrenceStatus[] = [
  'upcoming',
  'available',
  'started',
  'validation-requested',
  'completed',
  'postponed',
  'ignored',
];
const VALIDATION_FEEDBACK: readonly ValidationFeedback[] = [
  'small-step-remains',
  'review-together',
];
const VALIDATORS = ['child', 'parent', 'together'] as const;

function optionalEnum<T extends string>(
  source: Record<string, unknown>,
  key: string,
  values: readonly T[],
): T | undefined {
  return source[key] === undefined ? undefined : oneOf(source, key, values);
}

function hydrateSteps(value: unknown): readonly QuestStep[] {
  return list(value, 'steps').map((item, index) => {
    const source = record(item, `steps[${index}]`);
    return { id: text(source, 'id'), instruction: text(source, 'instruction') };
  });
}

export function hydrateChild(value: unknown): ChildProfile {
  const source = record(value, 'profil enfant');
  const entityMetadata = metadata(source);
  const created = createChildProfile(
    {
      displayName: text(source, 'displayName'),
      ageBand: oneOf(source, 'ageBand', AGE_BANDS),
      readingLevel: oneOf(source, 'readingLevel', READING_LEVELS),
      avatarId: text(source, 'avatarId'),
      accentId: text(source, 'accentId'),
      activeWorldId: text(source, 'activeWorldId'),
    },
    { id: entityMetadata.id, createdAt: entityMetadata.createdAt },
  );
  return { ...created, ...entityMetadata, isArchived: boolean(source, 'isArchived') };
}

export function hydrateQuestTemplate(value: unknown): QuestTemplate {
  const source = record(value, 'modèle de quête');
  const entityMetadata = metadata(source);
  const ageBands = stringList(source, 'ageBands');
  if (ageBands.some((age) => !AGE_BANDS.includes(age as AgeBand))) {
    throw new Error('ageBands contient une tranche d’âge inconnue.');
  }
  const estimatedMinutes = optionalInteger(source, 'estimatedMinutes', 1);
  const parentNote = optionalText(source, 'parentNote');
  const input: QuestTemplateInput = {
    title: text(source, 'title'),
    instruction: text(source, 'instruction'),
    categoryId: oneOf(source, 'categoryId', QUEST_CATEGORIES),
    illustrationId: text(source, 'illustrationId'),
    ageBands: ageBands as readonly AgeBand[],
    readingLevel: oneOf(source, 'readingLevel', READING_LEVELS),
    ...(estimatedMinutes !== undefined ? { estimatedMinutes } : {}),
    steps: hydrateSteps(source.steps),
    requiresAdultHelp: boolean(source, 'requiresAdultHelp'),
    defaultValidation: oneOf(source, 'defaultValidation', VALIDATION_MODES),
    rewardDefinitionId: text(source, 'rewardDefinitionId'),
    ...(parentNote !== undefined ? { parentNote } : {}),
  };
  const templateSource = oneOf(source, 'source', ['builtin', 'custom'] as const);
  const created = templateSource === 'builtin'
    ? createBuiltinQuestTemplate(input, {
        id: entityMetadata.id,
        createdAt: entityMetadata.createdAt,
        contentVersion: text(source, 'contentVersion'),
      })
    : createCustomQuestTemplate(input, {
        id: entityMetadata.id,
        createdAt: entityMetadata.createdAt,
      });
  return { ...created, ...entityMetadata, isArchived: boolean(source, 'isArchived') };
}

export function hydrateSchedule(value: unknown): QuestSchedule {
  const source = record(value, 'planification');
  const entityMetadata = metadata(source);
  const weekdayValues = source.weekdays === undefined
    ? undefined
    : stringList(source, 'weekdays');
  if (weekdayValues?.some((weekday) => !WEEKDAYS.includes(weekday as Weekday))) {
    throw new Error('weekdays contient un jour inconnu.');
  }
  const endDate = optionalText(source, 'endDate');
  const exactTime = optionalText(source, 'exactTime');
  const input: QuestScheduleInput = {
    questTemplateId: text(source, 'questTemplateId'),
    childIds: stringList(source, 'childIds'),
    kind: oneOf(source, 'kind', ['immediate', 'one-off', 'weekly'] as const),
    startDate: text(source, 'startDate'),
    ...(endDate !== undefined ? { endDate } : {}),
    ...(weekdayValues !== undefined ? { weekdays: weekdayValues as readonly Weekday[] } : {}),
    dayMoment: oneOf(source, 'dayMoment', DAY_MOMENTS),
    ...(exactTime !== undefined ? { exactTime } : {}),
    priority: oneOf(source, 'priority', ['required', 'optional'] as const),
    validationMode: oneOf(source, 'validationMode', VALIDATION_MODES),
  };
  const created = createQuestSchedule(input, {
    id: entityMetadata.id,
    createdAt: entityMetadata.createdAt,
  });
  return { ...created, ...entityMetadata, isSuspended: boolean(source, 'isSuspended') };
}

export function hydrateOccurrence(value: unknown): QuestOccurrence {
  const source = record(value, 'occurrence');
  const entityMetadata = metadata(source);
  const validationNote = optionalEnum(source, 'validationNote', VALIDATION_FEEDBACK);
  const startedAt = optionalText(source, 'startedAt');
  const validationRequestedAt = optionalText(source, 'validationRequestedAt');
  const completedAt = optionalText(source, 'completedAt');
  const postponedToValue = optionalText(source, 'postponedTo');
  const evidenceAssetId = optionalText(source, 'evidenceAssetId');
  const completionId = optionalText(source, 'completionId');
  return {
    ...entityMetadata,
    scheduleId: text(source, 'scheduleId'),
    questTemplateId: text(source, 'questTemplateId'),
    childId: text(source, 'childId'),
    localDate: normalizeLocalDate(text(source, 'localDate'), 'localDate'),
    dayMoment: oneOf(source, 'dayMoment', DAY_MOMENTS),
    status: oneOf(source, 'status', OCCURRENCE_STATUSES),
    ...(startedAt !== undefined ? { startedAt } : {}),
    ...(validationRequestedAt !== undefined ? { validationRequestedAt } : {}),
    ...(completedAt !== undefined ? { completedAt } : {}),
    ...(postponedToValue !== undefined
      ? { postponedTo: normalizeLocalDate(postponedToValue, 'postponedTo') }
      : {}),
    ...(validationNote !== undefined ? { validationNote } : {}),
    ...(evidenceAssetId !== undefined ? { evidenceAssetId } : {}),
    ...(completionId !== undefined ? { completionId } : {}),
  };
}

export function hydrateCompletion(value: unknown): Completion {
  const source = record(value, 'réalisation');
  return {
    ...metadata(source),
    occurrenceId: text(source, 'occurrenceId'),
    childId: text(source, 'childId'),
    validationMode: oneOf(source, 'validationMode', VALIDATION_MODES),
    validatedBy: oneOf(source, 'validatedBy', VALIDATORS),
    completedAt: text(source, 'completedAt'),
    rewardGrantId: text(source, 'rewardGrantId'),
  };
}

export function hydrateRewardGrant(value: unknown): RewardGrant {
  const source = record(value, 'récompense attribuée');
  return {
    ...metadata(source),
    childId: text(source, 'childId'),
    completionId: text(source, 'completionId'),
    rewardDefinitionId: text(source, 'rewardDefinitionId'),
    grantedAt: text(source, 'grantedAt'),
  };
}

export function hydrateWorldProgress(value: unknown): WorldProgress {
  const source = record(value, 'progression du monde');
  const stage = integer(source, 'stage');
  if (stage > 3) throw new Error('stage doit être compris entre 0 et 3.');
  const lastCelebrationAt = optionalText(source, 'lastCelebrationAt');
  return {
    ...metadata(source),
    childId: text(source, 'childId'),
    worldId: text(source, 'worldId'),
    worldVersion: text(source, 'worldVersion'),
    stage: stage as WorldProgress['stage'],
    completionCount: integer(source, 'completionCount'),
    unlockedRewardIds: stringList(source, 'unlockedRewardIds'),
    unlockedStoryChapterIds: stringList(source, 'unlockedStoryChapterIds'),
    ...(lastCelebrationAt !== undefined ? { lastCelebrationAt } : {}),
  };
}
