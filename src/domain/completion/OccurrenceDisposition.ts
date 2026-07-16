import { incrementRevision } from '../shared/entity';
import { assertDomain } from '../shared/errors';
import { compareLocalDates, normalizeLocalDate } from '../shared/localDate';
import type { QuestOccurrence } from './QuestOccurrenceTypes';

const TERMINAL_STATUSES: readonly QuestOccurrence['status'][] = ['completed', 'ignored'];

function assertDisposable(occurrence: QuestOccurrence): void {
  assertDomain(
    occurrence.deletedAt === undefined && !TERMINAL_STATUSES.includes(occurrence.status),
    'occurrence.invalid-disposition',
    'Cette quête ne peut plus être reportée ou laissée de côté.',
  );
}

export function postponeQuestOccurrence(
  occurrence: QuestOccurrence,
  postponedToValue: string,
  todayValue: string,
  updatedAt: string,
): QuestOccurrence {
  assertDisposable(occurrence);
  const postponedTo = normalizeLocalDate(postponedToValue, 'postponedTo');
  const today = normalizeLocalDate(todayValue, 'today');
  assertDomain(
    compareLocalDates(postponedTo, today) >= 0,
    'occurrence.invalid-disposition',
    'Une quête ne peut pas être reportée dans le passé.',
    'postponedTo',
  );

  return {
    ...occurrence,
    status: 'postponed',
    postponedTo,
    ...incrementRevision(occurrence, updatedAt),
  };
}

export function ignoreQuestOccurrence(
  occurrence: QuestOccurrence,
  updatedAt: string,
): QuestOccurrence {
  assertDisposable(occurrence);
  return {
    ...occurrence,
    status: 'ignored',
    ...incrementRevision(occurrence, updatedAt),
  };
}
