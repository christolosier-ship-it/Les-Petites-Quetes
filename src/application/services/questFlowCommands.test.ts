import { describe, expect, it } from 'vitest';
import {
  approveOccurrence,
  askAnotherStep,
  askJointReview,
  finishOccurrence,
  ignoreOccurrence,
  postponeOccurrence,
  startOccurrence,
} from './questFlowCommands';
import {
  createFamilyWithQuest,
  TEST_NOW,
  TEST_TODAY,
} from '../../tests/familyTestFixture';

describe('flux applicatif d’une quête', () => {
  it('termine une quête enfant et attribue une seule récompense', () => {
    const fixture = createFamilyWithQuest('child');
    const occurrenceId = fixture.state.occurrences[0]!.id;
    const started = startOccurrence(fixture.state, occurrenceId, TEST_NOW);
    const completed = finishOccurrence(
      started,
      occurrenceId,
      '2026-07-16T12:01:00.000Z',
      fixture.ids,
    );
    expect(completed.occurrences[0]).toMatchObject({ status: 'completed' });
    expect(completed.completions).toHaveLength(1);
    expect(completed.rewardGrants).toHaveLength(1);
    expect(completed.worldProgress[0]).toMatchObject({ completionCount: 1, stage: 0 });

    const repeated = finishOccurrence(
      completed,
      occurrenceId,
      '2026-07-16T12:02:00.000Z',
      fixture.ids,
    );
    expect(repeated.completions).toHaveLength(1);
    expect(repeated.rewardGrants).toHaveLength(1);
  });

  it('gère demande adulte, petite étape, revue ensemble et validation', () => {
    const fixture = createFamilyWithQuest('parent');
    const occurrenceId = fixture.state.occurrences[0]!.id;
    const requested = finishOccurrence(
      fixture.state,
      occurrenceId,
      TEST_NOW,
      fixture.ids,
    );
    expect(requested.occurrences[0]?.status).toBe('validation-requested');

    const anotherStep = askAnotherStep(
      requested,
      occurrenceId,
      '2026-07-16T12:01:00.000Z',
    );
    expect(anotherStep.occurrences[0]).toMatchObject({
      status: 'available',
      validationNote: 'small-step-remains',
    });

    const requestedAgain = finishOccurrence(
      anotherStep,
      occurrenceId,
      '2026-07-16T12:02:00.000Z',
      fixture.ids,
    );
    const jointReview = askJointReview(
      requestedAgain,
      occurrenceId,
      '2026-07-16T12:03:00.000Z',
    );
    expect(jointReview.occurrences[0]).toMatchObject({
      status: 'validation-requested',
      validationNote: 'review-together',
    });

    const approved = approveOccurrence(
      jointReview,
      occurrenceId,
      '2026-07-16T12:04:00.000Z',
      fixture.ids,
    );
    expect(approved.occurrences[0]?.status).toBe('completed');
    expect(approved.completions[0]).toMatchObject({ validatedBy: 'parent' });
  });

  it('reporte puis réactive une occurrence, et permet de la laisser de côté', () => {
    const fixture = createFamilyWithQuest('parent');
    const occurrenceId = fixture.state.occurrences[0]!.id;
    const postponed = postponeOccurrence(
      fixture.state,
      occurrenceId,
      '2026-07-17',
      TEST_TODAY,
      TEST_NOW,
    );
    expect(postponed.occurrences[0]).toMatchObject({
      status: 'postponed',
      postponedTo: '2026-07-17',
    });

    const ignored = ignoreOccurrence(
      fixture.state,
      occurrenceId,
      '2026-07-16T12:01:00.000Z',
    );
    expect(ignored.occurrences[0]?.status).toBe('ignored');
    expect(ignored.completions).toHaveLength(0);
    expect(ignored.rewardGrants).toHaveLength(0);
  });

  it('valide ensemble une quête configurée pour la coopération', () => {
    const fixture = createFamilyWithQuest('together');
    const occurrenceId = fixture.state.occurrences[0]!.id;
    const requested = finishOccurrence(fixture.state, occurrenceId, TEST_NOW, fixture.ids);
    const approved = approveOccurrence(
      requested,
      occurrenceId,
      '2026-07-16T12:01:00.000Z',
      fixture.ids,
    );
    expect(approved.completions[0]).toMatchObject({
      validationMode: 'together',
      validatedBy: 'together',
    });
  });
});
