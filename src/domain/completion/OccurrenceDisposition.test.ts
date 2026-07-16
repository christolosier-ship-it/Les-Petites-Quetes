import { describe, expect, it } from 'vitest';
import { DomainError } from '../shared/errors';
import type { QuestOccurrence } from './QuestOccurrenceTypes';
import { ignoreQuestOccurrence, postponeQuestOccurrence } from './OccurrenceDisposition';

const available: QuestOccurrence = {
  id: 'occ-1', scheduleId: 'schedule-1', questTemplateId: 'family.test.3-5', questFamilyId: 'family.test', worldId: 'world.firefly-forest', childId: 'child-1', localDate: '2026-07-16', dayMoment: 'morning', status: 'available', createdAt: 'created', updatedAt: 'created', revision: 1,
};

describe('disposition des occurrences', () => {
  it('reporte une quête sans la qualifier d’échec', () => {
    expect(postponeQuestOccurrence(available, '2026-07-18', '2026-07-16', 'updated')).toMatchObject({ status: 'postponed', postponedTo: '2026-07-18', revision: 2 });
  });
  it('refuse un report dans le passé', () => {
    expect(() => postponeQuestOccurrence(available, '2026-07-15', '2026-07-16', 'updated')).toThrowError(DomainError);
  });
  it('laisse une quête de côté de manière terminale et neutre', () => {
    const ignored = ignoreQuestOccurrence(available, 'updated');
    expect(ignored.status).toBe('ignored');
    expect(() => ignoreQuestOccurrence(ignored, 'later')).toThrowError(DomainError);
  });
});
