import { describe, expect, it } from 'vitest';
import { DomainError, type DomainErrorCode } from '../shared/errors';
import type { Weekday } from '../shared/types';
import {
  createQuestSchedule,
  resumeQuestSchedule,
  suspendQuestSchedule,
  updateQuestSchedule,
  type QuestScheduleInput,
  type ScheduleKind,
} from './QuestSchedule';

const weeklyInput: QuestScheduleInput = {
  questTemplateId: 'quest.brush-teeth',
  childIds: ['child-1', 'child-2'],
  kind: 'weekly',
  startDate: '2026-07-16',
  endDate: '2026-08-31',
  weekdays: ['mon', 'thu'],
  dayMoment: 'morning',
  exactTime: '07:30',
  priority: 'required',
  validationMode: 'parent',
};

function createSchedule() {
  return createQuestSchedule(weeklyInput, {
    id: 'schedule-1',
    createdAt: '2026-07-16T08:00:00.000Z',
  });
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

describe('QuestSchedule', () => {
  it('crée une planification hebdomadaire normalisée', () => {
    const schedule = createSchedule();
    expect(schedule).toMatchObject({
      id: 'schedule-1',
      questTemplateId: 'quest.brush-teeth',
      childIds: ['child-1', 'child-2'],
      kind: 'weekly',
      startDate: '2026-07-16',
      endDate: '2026-08-31',
      weekdays: ['mon', 'thu'],
      dayMoment: 'morning',
      exactTime: '07:30',
      isSuspended: false,
      revision: 1,
    });
  });

  it('accepte une planification ponctuelle sans jours ni date de fin', () => {
    const schedule = createQuestSchedule(
      {
        ...weeklyInput,
        kind: 'one-off',
        childIds: ['child-1'],
        startDate: '2026-07-20',
        endDate: undefined,
        weekdays: undefined,
        exactTime: undefined,
      },
      { id: 'schedule-one-off', createdAt: 'now' },
    );
    expect(schedule.kind).toBe('one-off');
    expect(schedule.weekdays).toBeUndefined();
    expect(schedule.endDate).toBeUndefined();
  });

  it('refuse les enfants et jours dupliqués', () => {
    expectDomainError(
      () =>
        createQuestSchedule(
          { ...weeklyInput, childIds: ['child-1', 'child-1'] },
          { id: 'duplicate-child', createdAt: 'now' },
        ),
      'schedule.child-duplicated',
    );
    expectDomainError(
      () =>
        createQuestSchedule(
          { ...weeklyInput, weekdays: ['mon', 'mon'] },
          { id: 'duplicate-weekday', createdAt: 'now' },
        ),
      'schedule.weekday-duplicated',
    );
  });

  it('refuse une plage inversée et les champs incompatibles avec une quête ponctuelle', () => {
    expectDomainError(
      () =>
        createQuestSchedule(
          { ...weeklyInput, startDate: '2026-08-01', endDate: '2026-07-31' },
          { id: 'invalid-range', createdAt: 'now' },
        ),
      'schedule.invalid-date-range',
    );
    expectDomainError(
      () =>
        createQuestSchedule(
          { ...weeklyInput, kind: 'one-off', endDate: undefined },
          { id: 'weekday-once', createdAt: 'now' },
        ),
      'schedule.weekdays-not-allowed',
    );
    expectDomainError(
      () =>
        createQuestSchedule(
          { ...weeklyInput, kind: 'immediate', weekdays: undefined },
          { id: 'end-immediate', createdAt: 'now' },
        ),
      'schedule.end-date-not-allowed',
    );
  });

  it('refuse les valeurs importées inconnues', () => {
    expectDomainError(
      () =>
        createQuestSchedule(
          { ...weeklyInput, kind: 'monthly' as ScheduleKind },
          { id: 'invalid-kind', createdAt: 'now' },
        ),
      'schedule.invalid-kind',
    );
    expectDomainError(
      () =>
        createQuestSchedule(
          { ...weeklyInput, weekdays: ['noday' as Weekday] },
          { id: 'invalid-weekday', createdAt: 'now' },
        ),
      'schedule.invalid-weekday',
    );
  });

  it('met à jour les champs optionnels sans conserver les anciennes valeurs', () => {
    const updated = updateQuestSchedule(
      createSchedule(),
      {
        kind: 'one-off',
        startDate: '2026-09-01',
        endDate: null,
        weekdays: null,
        exactTime: null,
        childIds: ['child-1'],
      },
      '2026-07-16T09:00:00.000Z',
    );
    expect(updated.kind).toBe('one-off');
    expect(updated.endDate).toBeUndefined();
    expect(updated.weekdays).toBeUndefined();
    expect(updated.exactTime).toBeUndefined();
    expect(updated.revision).toBe(2);
  });

  it('suspend et reprend de façon idempotente', () => {
    const schedule = createSchedule();
    const suspended = suspendQuestSchedule(schedule, 'suspended');
    expect(suspended.isSuspended).toBe(true);
    expect(suspendQuestSchedule(suspended, 'again')).toBe(suspended);

    const resumed = resumeQuestSchedule(suspended, 'resumed');
    expect(resumed.isSuspended).toBe(false);
    expect(resumeQuestSchedule(resumed, 'again')).toBe(resumed);
  });
});
