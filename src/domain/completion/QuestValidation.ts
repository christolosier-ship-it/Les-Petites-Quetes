import { incrementRevision } from '../shared/entity';
import { assertDomain } from '../shared/errors';
import type { ValidationMode } from '../shared/types';
import type { QuestOccurrence } from './QuestOccurrenceTypes';

export type { QuestOccurrence, QuestOccurrenceStatus } from './QuestOccurrenceTypes';

function assertCanBeWorkedOn(occurrence: QuestOccurrence): void {
  assertDomain(
    occurrence.deletedAt === undefined,
    'validation.invalid-transition',
    'Une occurrence supprimée ne peut plus changer d’état.',
  );
}

function assertStatus(
  occurrence: QuestOccurrence,
  allowed: readonly QuestOccurrence['status'][],
  action: string,
): void {
  assertDomain(
    allowed.includes(occurrence.status),
    'validation.invalid-transition',
    `La quête ne peut pas ${action} depuis l’état « ${occurrence.status} ».`,
  );
}

function completeOccurrence(occurrence: QuestOccurrence, completedAt: string): QuestOccurrence {
  return {
    ...occurrence,
    status: 'completed',
    completedAt,
    ...incrementRevision(occurrence, completedAt),
  };
}

export function startQuestOccurrence(
  occurrence: QuestOccurrence,
  startedAt: string,
): QuestOccurrence {
  assertCanBeWorkedOn(occurrence);
  if (occurrence.status === 'started') return occurrence;
  assertStatus(occurrence, ['available'], 'être commencée');

  return {
    ...occurrence,
    status: 'started',
    startedAt,
    ...incrementRevision(occurrence, startedAt),
  };
}

export function requestQuestValidation(
  occurrence: QuestOccurrence,
  mode: ValidationMode,
  requestedAt: string,
): QuestOccurrence {
  assertCanBeWorkedOn(occurrence);
  if (occurrence.status === 'completed') return occurrence;
  if (occurrence.status === 'validation-requested' && mode !== 'child') return occurrence;
  assertStatus(occurrence, ['available', 'started'], 'être proposée à la validation');

  if (mode === 'child') return completeOccurrence(occurrence, requestedAt);

  return {
    ...occurrence,
    status: 'validation-requested',
    validationRequestedAt: requestedAt,
    ...incrementRevision(occurrence, requestedAt),
  };
}

export function approveQuestValidation(
  occurrence: QuestOccurrence,
  mode: Exclude<ValidationMode, 'child'>,
  approvedAt: string,
): QuestOccurrence {
  assertCanBeWorkedOn(occurrence);
  assertDomain(
    mode === 'parent' || mode === 'together',
    'validation.adult-mode-required',
    'Une validation en attente doit être confirmée par un adulte ou ensemble.',
  );
  if (occurrence.status === 'completed') return occurrence;
  assertStatus(occurrence, ['validation-requested'], 'être validée');
  return completeOccurrence(occurrence, approvedAt);
}

export function requestAnotherStep(
  occurrence: QuestOccurrence,
  decidedAt: string,
): QuestOccurrence {
  assertCanBeWorkedOn(occurrence);
  assertStatus(occurrence, ['validation-requested'], 'revenir à une petite étape');

  return {
    ...occurrence,
    status: 'available',
    validationFeedback: 'small-step-remains',
    ...incrementRevision(occurrence, decidedAt),
  };
}

export function requestJointReview(
  occurrence: QuestOccurrence,
  decidedAt: string,
): QuestOccurrence {
  assertCanBeWorkedOn(occurrence);
  assertStatus(occurrence, ['validation-requested'], 'être regardée ensemble');

  return {
    ...occurrence,
    validationFeedback: 'review-together',
    ...incrementRevision(occurrence, decidedAt),
  };
}
