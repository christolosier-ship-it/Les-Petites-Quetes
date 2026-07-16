import { describe, expect, it } from 'vitest';
import { DomainError, type DomainErrorCode } from '../shared/errors';
import type { ValidationMode } from '../shared/types';
import {
  approveQuestValidation,
  requestAnotherStep,
  requestJointReview,
  requestQuestValidation,
  startQuestOccurrence,
  type QuestOccurrence,
} from './QuestValidation';

function occurrence(status: QuestOccurrence['status'] = 'available'): QuestOccurrence {
  return {
    id: 'occurrence-1',
    scheduleId: 'schedule-1',
    questTemplateId: 'quest-1',
    childId: 'child-1',
    localDate: '2026-07-16',
    dayMoment: 'morning',
    status,
    createdAt: '2026-07-16T07:00:00.000Z',
    updatedAt: '2026-07-16T07:00:00.000Z',
    revision: 1,
  };
}

function expectDomainError(run: () => unknown, code: DomainErrorCode): void {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    if (error instanceof DomainError) expect(error.code).toBe(code);
    return;
  }
  throw new Error(`L’erreur métier ${code} était attendue.`);
}

describe('validation des quêtes', () => {
  it('permet de commencer uniquement une quête disponible', () => {
    const started = startQuestOccurrence(occurrence(), '2026-07-16T08:00:00.000Z');
    expect(started.status).toBe('started');
    expect(started.startedAt).toBe('2026-07-16T08:00:00.000Z');
    expect(startQuestOccurrence(started, 'later')).toBe(started);
    expectDomainError(
      () => startQuestOccurrence(occurrence('upcoming'), 'now'),
      'validation.invalid-transition',
    );
  });

  it('termine immédiatement une quête validée par l’enfant', () => {
    const completed = requestQuestValidation(
      occurrence(),
      'child',
      '2026-07-16T08:00:00.000Z',
    );
    expect(completed.status).toBe('completed');
    expect(completed.completedAt).toBe('2026-07-16T08:00:00.000Z');
    expect(completed.validationRequestedAt).toBeUndefined();
    expect(completed.completionId).toBeUndefined();
  });

  it('crée une demande neutre pour la validation parent ou ensemble', () => {
    const requested = requestQuestValidation(
      occurrence('started'),
      'parent',
      '2026-07-16T08:05:00.000Z',
    );
    expect(requested.status).toBe('validation-requested');
    expect(requested.validationRequestedAt).toBe('2026-07-16T08:05:00.000Z');
    expect(requestQuestValidation(requested, 'parent', 'later')).toBe(requested);
  });

  it('valide une demande une seule fois', () => {
    const requested = requestQuestValidation(occurrence(), 'together', 'requested');
    const completed = approveQuestValidation(requested, 'together', 'approved');
    expect(completed.status).toBe('completed');
    expect(completed.revision).toBe(3);
    expect(approveQuestValidation(completed, 'together', 'again')).toBe(completed);
  });

  it('remet la quête disponible avec un code de retour non culpabilisant', () => {
    const requested = requestQuestValidation(occurrence(), 'parent', 'requested');
    const retry = requestAnotherStep(requested, 'decision');
    expect(retry.status).toBe('available');
    expect(retry.validationFeedback).toBe('small-step-remains');
    expect(retry.completedAt).toBeUndefined();
    expect(retry.completionId).toBeUndefined();
  });

  it('permet de regarder ensemble sans fermer la demande', () => {
    const requested = requestQuestValidation(occurrence(), 'parent', 'requested');
    const jointReview = requestJointReview(requested, 'decision');
    expect(jointReview.status).toBe('validation-requested');
    expect(jointReview.validationFeedback).toBe('review-together');
  });

  it('refuse les transitions et modes incompatibles', () => {
    expectDomainError(
      () => requestAnotherStep(occurrence('available'), 'now'),
      'validation.invalid-transition',
    );
    expectDomainError(
      () =>
        approveQuestValidation(
          requestQuestValidation(occurrence(), 'parent', 'requested'),
          'child' as Exclude<ValidationMode, 'child'>,
          'approved',
        ),
      'validation.adult-mode-required',
    );
  });

  it('ne rouvre jamais une occurrence terminée', () => {
    const completed = requestQuestValidation(occurrence(), 'child', 'completed');
    expect(requestQuestValidation(completed, 'parent', 'later')).toBe(completed);
    expectDomainError(
      () => startQuestOccurrence(completed, 'later'),
      'validation.invalid-transition',
    );
  });
});
