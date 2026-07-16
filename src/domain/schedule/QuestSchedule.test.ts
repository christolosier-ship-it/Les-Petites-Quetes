import { describe, expect, it } from 'vitest';
import { DomainError } from '../shared/errors';
import {
  createQuestSchedule,
  resumeQuestSchedule,
  suspendQuestSchedule,
  updateQuestSchedule,
  type QuestScheduleInput,
} from './QuestSchedule';

const weeklyInput: QuestScheduleInput = {
  questTemplateId: 'family.morning.dress.3-5',
  questFamilyId: 'family.morning.dress',
  worldId: 'world.dragon-mountain',
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

describe('QuestSchedule V3', () => {
  it('crée une routine multi-enfants rattachée à un univers', () => {
    const schedule = createQuestSchedule(weeklyInput, { id: 'schedule-1', createdAt: 'now' });
    expect(schedule).toMatchObject({ worldId: 'world.dragon-mountain', questFamilyId: 'family.morning.dress', childIds: ['child-1', 'child-2'], kind: 'weekly', isSuspended: false });
  });

  it('refuse un univers inconnu et une plage inversée', () => {
    expect(() => createQuestSchedule({ ...weeklyInput, worldId: 'world.unknown' as typeof weeklyInput.worldId }, { id: 'bad-world', createdAt: 'now' })).toThrowError(DomainError);
    expect(() => createQuestSchedule({ ...weeklyInput, endDate: '2026-07-15' }, { id: 'bad-date', createdAt: 'now' })).toThrowError(DomainError);
  });

  it('supprime les champs hebdomadaires lors du passage à une date ponctuelle', () => {
    const schedule = createQuestSchedule(weeklyInput, { id: 'schedule-1', createdAt: 'now' });
    const updated = updateQuestSchedule(schedule, {
      kind: 'one-off',
      startDate: '2026-07-20',
      endDate: null,
      weekdays: null,
      exactTime: null,
      dayMoment: 'anytime',
    }, 'later');
    expect(updated).toMatchObject({ kind: 'one-off', startDate: '2026-07-20', dayMoment: 'anytime', revision: 2 });
    expect(updated.endDate).toBeUndefined();
    expect(updated.weekdays).toBeUndefined();
    expect(updated.exactTime).toBeUndefined();
  });

  it('suspend et reprend de manière idempotente', () => {
    const schedule = createQuestSchedule(weeklyInput, { id: 'schedule-1', createdAt: 'now' });
    const suspended = suspendQuestSchedule(schedule, 'pause');
    expect(suspended.isSuspended).toBe(true);
    expect(suspendQuestSchedule(suspended, 'again')).toBe(suspended);
    const resumed = resumeQuestSchedule(suspended, 'resume');
    expect(resumed).toMatchObject({ isSuspended: false, revision: 3 });
  });

  it('refuse les enfants dupliqués', () => {
    expect(() => createQuestSchedule({ ...weeklyInput, childIds: ['child-1', 'child-1'] }, { id: 'duplicate', createdAt: 'now' })).toThrowError(DomainError);
  });
});
