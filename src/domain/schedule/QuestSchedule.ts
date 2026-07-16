import { createEntityMetadata, incrementRevision } from '../shared/entity';
import { assertDomain } from '../shared/errors';
import { compareLocalDates, normalizeExactTime, normalizeLocalDate } from '../shared/localDate';
import {
  DAY_MOMENTS,
  VALIDATION_MODES,
  WEEKDAYS,
  belongsTo,
  type Weekday,
} from '../shared/types';
import { isWorldId } from '../world/WorldDefinition';
import { hasDuplicates, requireIdentifier } from '../shared/validation';
import {
  QUEST_PRIORITIES,
  SCHEDULE_KINDS,
  type QuestSchedule,
  type QuestScheduleChanges,
  type QuestScheduleInput,
} from './QuestScheduleTypes';

export type { QuestPriority, QuestSchedule, QuestScheduleChanges, QuestScheduleInput, ScheduleKind } from './QuestScheduleTypes';

function normalizeChildIds(childIds: readonly string[]): readonly string[] {
  assertDomain(childIds.length > 0, 'schedule.child-required', 'Une planification doit concerner au moins un enfant.', 'childIds');
  const normalized = childIds.map((childId, index) => requireIdentifier(childId, 'schedule.identifier-required', 'Chaque enfant doit posséder un identifiant.', `childIds.${index}`));
  assertDomain(!hasDuplicates(normalized), 'schedule.child-duplicated', 'Un enfant ne peut être attribué deux fois à la même planification.', 'childIds');
  return normalized;
}

function normalizeWeekdays(kind: QuestScheduleInput['kind'], weekdays: readonly Weekday[] | undefined): readonly Weekday[] | undefined {
  if (kind !== 'weekly') {
    assertDomain(weekdays === undefined || weekdays.length === 0, 'schedule.weekdays-not-allowed', 'Les jours de semaine sont réservés aux planifications hebdomadaires.', 'weekdays');
    return undefined;
  }
  assertDomain(weekdays !== undefined && weekdays.length > 0, 'schedule.weekdays-required', 'Une planification hebdomadaire doit contenir au moins un jour.', 'weekdays');
  for (const weekday of weekdays) assertDomain(belongsTo(weekday, WEEKDAYS), 'schedule.invalid-weekday', 'Un jour de semaine est inconnu.', 'weekdays');
  assertDomain(!hasDuplicates(weekdays), 'schedule.weekday-duplicated', 'Un jour de semaine ne peut apparaître qu’une fois.', 'weekdays');
  return [...weekdays];
}

function normalizeInput(input: QuestScheduleInput): QuestScheduleInput {
  assertDomain(belongsTo(input.kind, SCHEDULE_KINDS), 'schedule.invalid-kind', 'Le type de planification est inconnu.', 'kind');
  assertDomain(belongsTo(input.dayMoment, DAY_MOMENTS), 'schedule.invalid-day-moment', 'Le moment de la journée est inconnu.', 'dayMoment');
  assertDomain(belongsTo(input.priority, QUEST_PRIORITIES), 'schedule.invalid-priority', 'La priorité de la quête est inconnue.', 'priority');
  assertDomain(belongsTo(input.validationMode, VALIDATION_MODES), 'schedule.invalid-validation-mode', 'Le mode de validation de la quête est inconnu.', 'validationMode');
  assertDomain(isWorldId(input.worldId), 'schedule.invalid-world', 'L’univers de la planification est inconnu.', 'worldId');
  const startDate = normalizeLocalDate(input.startDate, 'startDate');
  const endDate = input.endDate === undefined ? undefined : normalizeLocalDate(input.endDate, 'endDate');
  if (input.kind !== 'weekly') {
    assertDomain(endDate === undefined, 'schedule.end-date-not-allowed', 'Une planification immédiate ou ponctuelle ne possède pas de date de fin.', 'endDate');
  } else if (endDate !== undefined) {
    assertDomain(compareLocalDates(startDate, endDate) <= 0, 'schedule.invalid-date-range', 'La date de fin doit être postérieure ou égale à la date de début.', 'endDate');
  }
  const weekdays = normalizeWeekdays(input.kind, input.weekdays);
  const exactTime = input.exactTime === undefined ? undefined : normalizeExactTime(input.exactTime);
  return {
    questTemplateId: requireIdentifier(input.questTemplateId, 'schedule.identifier-required', 'Un modèle de quête est requis.', 'questTemplateId'),
    questFamilyId: requireIdentifier(input.questFamilyId, 'schedule.identifier-required', 'Une famille de quête est requise.', 'questFamilyId'),
    worldId: input.worldId,
    childIds: normalizeChildIds(input.childIds),
    kind: input.kind,
    startDate,
    ...(endDate !== undefined ? { endDate } : {}),
    ...(weekdays !== undefined ? { weekdays } : {}),
    dayMoment: input.dayMoment,
    ...(exactTime !== undefined ? { exactTime } : {}),
    priority: input.priority,
    validationMode: input.validationMode,
  };
}

function buildInput(schedule: QuestSchedule, changes: QuestScheduleChanges): QuestScheduleInput {
  const endDate = changes.endDate === null ? undefined : (changes.endDate ?? schedule.endDate);
  const weekdays = changes.weekdays === null ? undefined : (changes.weekdays ?? schedule.weekdays);
  const exactTime = changes.exactTime === null ? undefined : (changes.exactTime ?? schedule.exactTime);
  return {
    questTemplateId: changes.questTemplateId ?? schedule.questTemplateId,
    questFamilyId: changes.questFamilyId ?? schedule.questFamilyId,
    worldId: changes.worldId ?? schedule.worldId,
    childIds: changes.childIds ?? schedule.childIds,
    kind: changes.kind ?? schedule.kind,
    startDate: changes.startDate ?? schedule.startDate,
    ...(endDate !== undefined ? { endDate } : {}),
    ...(weekdays !== undefined ? { weekdays } : {}),
    dayMoment: changes.dayMoment ?? schedule.dayMoment,
    ...(exactTime !== undefined ? { exactTime } : {}),
    priority: changes.priority ?? schedule.priority,
    validationMode: changes.validationMode ?? schedule.validationMode,
  };
}

function assertMutable(schedule: QuestSchedule): void {
  assertDomain(schedule.deletedAt === undefined, 'schedule.deleted-readonly', 'Une planification supprimée ne peut plus être modifiée.');
}

export function createQuestSchedule(input: QuestScheduleInput, identity: { readonly id: string; readonly createdAt: string }): QuestSchedule {
  return { ...createEntityMetadata(identity.id, identity.createdAt), ...normalizeInput(input), isSuspended: false };
}

export function updateQuestSchedule(schedule: QuestSchedule, changes: QuestScheduleChanges, updatedAt: string): QuestSchedule {
  assertMutable(schedule);
  return { ...incrementRevision(schedule, updatedAt), ...normalizeInput(buildInput(schedule, changes)), isSuspended: schedule.isSuspended };
}

export function suspendQuestSchedule(schedule: QuestSchedule, updatedAt: string): QuestSchedule {
  assertMutable(schedule);
  if (schedule.isSuspended) return schedule;
  return { ...schedule, isSuspended: true, ...incrementRevision(schedule, updatedAt) };
}

export function resumeQuestSchedule(schedule: QuestSchedule, updatedAt: string): QuestSchedule {
  assertMutable(schedule);
  if (!schedule.isSuspended) return schedule;
  return { ...schedule, isSuspended: false, ...incrementRevision(schedule, updatedAt) };
}
