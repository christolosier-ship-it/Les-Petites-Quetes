import { describe, expect, it } from 'vitest';
import { DomainError, type DomainErrorCode } from '../shared/errors';
import type { ValidationMode } from '../shared/types';
import { approveQuestValidation, requestAnotherStep, requestJointReview, requestQuestValidation, startQuestOccurrence, type QuestOccurrence } from './QuestValidation';

function occurrence(status: QuestOccurrence['status'] = 'available'): QuestOccurrence {
  return { id: 'occurrence-1', scheduleId: 'schedule-1', questTemplateId: 'family.test.3-5', questFamilyId: 'family.test', worldId: 'world.firefly-forest', childId: 'child-1', localDate: '2026-07-16', dayMoment: 'morning', status, createdAt: '2026-07-16T07:00:00.000Z', updatedAt: '2026-07-16T07:00:00.000Z', revision: 1 };
}
function expectDomainError(run: () => unknown, code: DomainErrorCode): void {
  try { run(); } catch (error) { expect(error).toBeInstanceOf(DomainError); if (error instanceof DomainError) expect(error.code).toBe(code); return; }
  throw new Error(`L’erreur métier ${code} était attendue.`);
}

describe('validation des quêtes', () => {
  it('permet de commencer uniquement une quête disponible', () => {
    const started = startQuestOccurrence(occurrence(), '2026-07-16T08:00:00.000Z');
    expect(started).toMatchObject({ status: 'started', startedAt: '2026-07-16T08:00:00.000Z' });
    expect(startQuestOccurrence(started, 'later')).toBe(started);
    expectDomainError(() => startQuestOccurrence(occurrence('upcoming'), 'now'), 'validation.invalid-transition');
  });
  it('termine immédiatement une quête validée par l’enfant', () => {
    const completed = requestQuestValidation(occurrence(), 'child', '2026-07-16T08:00:00.000Z');
    expect(completed).toMatchObject({ status: 'completed', completedAt: '2026-07-16T08:00:00.000Z' });
    expect(completed.validationRequestedAt).toBeUndefined();
  });
  it('crée une demande neutre pour la validation parent ou ensemble', () => {
    const requested = requestQuestValidation(occurrence('started'), 'parent', '2026-07-16T08:05:00.000Z');
    expect(requested).toMatchObject({ status: 'validation-requested', validationRequestedAt: '2026-07-16T08:05:00.000Z' });
    expect(requestQuestValidation(requested, 'parent', 'later')).toBe(requested);
  });
  it('valide une demande une seule fois', () => {
    const requested = requestQuestValidation(occurrence(), 'together', 'requested');
    const completed = approveQuestValidation(requested, 'together', 'approved');
    expect(completed).toMatchObject({ status: 'completed', revision: 3 });
    expect(approveQuestValidation(completed, 'together', 'again')).toBe(completed);
  });
  it('remet la quête disponible avec un code de retour non culpabilisant', () => {
    const retry = requestAnotherStep(requestQuestValidation(occurrence(), 'parent', 'requested'), 'decision');
    expect(retry).toMatchObject({ status: 'available', validationNote: 'small-step-remains' });
  });
  it('permet de regarder ensemble sans fermer la demande', () => {
    const jointReview = requestJointReview(requestQuestValidation(occurrence(), 'parent', 'requested'), 'decision');
    expect(jointReview).toMatchObject({ status: 'validation-requested', validationNote: 'review-together' });
  });
  it('refuse les transitions et modes incompatibles', () => {
    expectDomainError(() => requestAnotherStep(occurrence('available'), 'now'), 'validation.invalid-transition');
    expectDomainError(() => approveQuestValidation(requestQuestValidation(occurrence(), 'parent', 'requested'), 'child' as Exclude<ValidationMode, 'child'>, 'approved'), 'validation.adult-mode-required');
  });
  it('ne rouvre jamais une occurrence terminée', () => {
    const completed = requestQuestValidation(occurrence(), 'child', 'completed');
    expect(requestQuestValidation(completed, 'parent', 'later')).toBe(completed);
    expectDomainError(() => startQuestOccurrence(completed, 'later'), 'validation.invalid-transition');
  });
});
