import type { ChildProfile } from '../child/ChildProfile';
import type { QuestOccurrence } from '../completion/QuestOccurrenceTypes';
import { createEntityMetadata, incrementRevision } from '../shared/entity';
import { assertDomain } from '../shared/errors';
import {
  compareLocalDates,
  enumerateLocalDates,
  normalizeLocalDate,
  weekdayOfLocalDate,
} from '../shared/localDate';
import type { QuestSchedule } from './QuestScheduleTypes';

export interface OccurrenceGenerationRange {
  readonly fromDate: string;
  readonly toDate: string;
  readonly today: string;
  readonly generatedAt: string;
}

export interface OccurrenceIdentitySeed {
  readonly scheduleId: string;
  readonly childId: string;
  readonly localDate: string;
}

export type OccurrenceIdFactory = (seed: OccurrenceIdentitySeed) => string;

interface GenerateOccurrencesInput {
  readonly schedule: QuestSchedule;
  readonly children: readonly ChildProfile[];
  readonly existingOccurrences: readonly QuestOccurrence[];
  readonly generationRange: OccurrenceGenerationRange;
  readonly createOccurrenceId: OccurrenceIdFactory;
}

function occurrenceKey(scheduleId: string, childId: string, localDate: string): string {
  return `${scheduleId}::${childId}::${localDate}`;
}

function datesForSchedule(
  schedule: QuestSchedule,
  fromDate: string,
  toDate: string,
): readonly string[] {
  if (schedule.kind !== 'weekly') {
    return compareLocalDates(schedule.startDate, fromDate) >= 0 &&
      compareLocalDates(schedule.startDate, toDate) <= 0
      ? [schedule.startDate]
      : [];
  }

  const effectiveFrom = compareLocalDates(schedule.startDate, fromDate) > 0 ? schedule.startDate : fromDate;
  const effectiveTo =
    schedule.endDate !== undefined && compareLocalDates(schedule.endDate, toDate) < 0
      ? schedule.endDate
      : toDate;
  if (compareLocalDates(effectiveFrom, effectiveTo) > 0) return [];

  const weekdays = new Set(schedule.weekdays ?? []);
  return enumerateLocalDates(effectiveFrom, effectiveTo).filter((date) =>
    weekdays.has(weekdayOfLocalDate(date)),
  );
}

function activeChildById(children: readonly ChildProfile[], childId: string): ChildProfile | undefined {
  const child = children.find((candidate) => candidate.id === childId);
  assertDomain(
    child !== undefined,
    'occurrence.child-not-found',
    'Un enfant attribué à la planification est introuvable.',
    'childIds',
  );
  return child.deletedAt === undefined && !child.isArchived ? child : undefined;
}

export function generateQuestOccurrences(input: GenerateOccurrencesInput): readonly QuestOccurrence[] {
  if (input.schedule.deletedAt !== undefined || input.schedule.isSuspended) return [];

  const fromDate = normalizeLocalDate(input.generationRange.fromDate, 'fromDate');
  const toDate = normalizeLocalDate(input.generationRange.toDate, 'toDate');
  const today = normalizeLocalDate(input.generationRange.today, 'today');
  assertDomain(
    compareLocalDates(fromDate, toDate) <= 0,
    'occurrence.invalid-generation-range',
    'La fin de la plage doit être postérieure ou égale au début.',
  );

  const dates = datesForSchedule(input.schedule, fromDate, toDate);
  const existingKeys = new Set(
    input.existingOccurrences.map((occurrence) =>
      occurrenceKey(occurrence.scheduleId, occurrence.childId, occurrence.localDate),
    ),
  );
  const usedIds = new Set(input.existingOccurrences.map((occurrence) => occurrence.id));
  const generated: QuestOccurrence[] = [];

  for (const childId of input.schedule.childIds) {
    const child = activeChildById(input.children, childId);
    if (child === undefined) continue;

    for (const localDate of dates) {
      const key = occurrenceKey(input.schedule.id, child.id, localDate);
      if (existingKeys.has(key)) continue;

      const id = input.createOccurrenceId({
        scheduleId: input.schedule.id,
        childId: child.id,
        localDate,
      });
      assertDomain(
        !usedIds.has(id),
        'occurrence.id-collision',
        'Deux occurrences ne peuvent pas partager le même identifiant.',
        'id',
      );

      generated.push({
        ...createEntityMetadata(id, input.generationRange.generatedAt),
        scheduleId: input.schedule.id,
        questTemplateId: input.schedule.questTemplateId,
        childId: child.id,
        localDate,
        dayMoment: input.schedule.dayMoment,
        status: compareLocalDates(localDate, today) > 0 ? 'upcoming' : 'available',
      });
      existingKeys.add(key);
      usedIds.add(id);
    }
  }

  return generated;
}

export function releaseDueQuestOccurrences(
  occurrences: readonly QuestOccurrence[],
  todayValue: string,
  updatedAt: string,
): readonly QuestOccurrence[] {
  const today = normalizeLocalDate(todayValue, 'today');
  return occurrences.map((occurrence) => {
    if (
      occurrence.deletedAt !== undefined ||
      occurrence.status !== 'upcoming' ||
      compareLocalDates(occurrence.localDate, today) > 0
    ) {
      return occurrence;
    }

    return {
      ...occurrence,
      status: 'available',
      ...incrementRevision(occurrence, updatedAt),
    };
  });
}
