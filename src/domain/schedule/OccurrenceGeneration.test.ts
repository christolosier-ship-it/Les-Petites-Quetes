import { describe, expect, it } from 'vitest';
import { createChildProfile } from '../child/ChildProfile';
import { DomainError } from '../shared/errors';
import { createQuestSchedule } from './QuestSchedule';
import { generateQuestOccurrences, releaseDueQuestOccurrences } from './OccurrenceGeneration';

const createdAt = '2026-07-16T08:00:00.000Z';
const child35 = createChildProfile({ displayName: 'Maddie', ageBand: '3-5', readingLevel: 'visual', avatarId: 'avatar.girl.3-5' }, { id: 'child-35', createdAt });
const child68 = createChildProfile({ displayName: 'Nais', ageBand: '6-8', readingLevel: 'short-text', avatarId: 'avatar.girl.6-8' }, { id: 'child-68', createdAt });
const schedule = createQuestSchedule({
  questTemplateId: 'family.morning.dress.3-5',
  questFamilyId: 'family.morning.dress',
  worldId: 'world.dragon-mountain',
  childIds: [child35.id, child68.id],
  kind: 'weekly',
  startDate: '2026-07-16',
  endDate: '2026-07-31',
  weekdays: ['thu'],
  dayMoment: 'morning',
  priority: 'required',
  validationMode: 'parent',
}, { id: 'schedule-1', createdAt });

function generate(existingOccurrences = [] as const) {
  return generateQuestOccurrences({
    schedule,
    children: [child35, child68],
    existingOccurrences,
    generationRange: { fromDate: '2026-07-16', toDate: '2026-07-23', today: '2026-07-16', generatedAt: createdAt },
    createOccurrenceId: ({ childId, localDate }) => `${childId}-${localDate}`,
    resolveQuestVariantId: (familyId, ageBand) => `${familyId}.${ageBand}`,
  });
}

describe('OccurrenceGeneration V3', () => {
  it('génère une variante différente par âge dans le même univers', () => {
    const occurrences = generate();
    expect(occurrences).toHaveLength(4);
    expect(occurrences.filter((item) => item.childId === child35.id).every((item) => item.questTemplateId.endsWith('.3-5'))).toBe(true);
    expect(occurrences.filter((item) => item.childId === child68.id).every((item) => item.questTemplateId.endsWith('.6-8'))).toBe(true);
    expect(new Set(occurrences.map((item) => item.questFamilyId))).toEqual(new Set(['family.morning.dress']));
    expect(new Set(occurrences.map((item) => item.worldId))).toEqual(new Set(['world.dragon-mountain']));
  });

  it('ne régénère pas une clé métier existante, même terminée', () => {
    const initial = generate();
    const completed = { ...initial[0]!, status: 'completed' as const, completedAt: 'later', completionId: 'completion-1' };
    const next = generate([completed, ...initial.slice(1)]);
    expect(next).toHaveLength(0);
  });

  it('ignore les profils archivés et les routines suspendues', () => {
    const archivedChild = { ...child35, isArchived: true };
    const onlyActive = generateQuestOccurrences({
      schedule,
      children: [archivedChild, child68],
      existingOccurrences: [],
      generationRange: { fromDate: '2026-07-16', toDate: '2026-07-16', today: '2026-07-16', generatedAt: createdAt },
      createOccurrenceId: ({ childId }) => childId,
    });
    expect(onlyActive).toHaveLength(1);
    const suspended = generateQuestOccurrences({
      schedule: { ...schedule, isSuspended: true },
      children: [child35, child68],
      existingOccurrences: [],
      generationRange: { fromDate: '2026-07-16', toDate: '2026-07-16', today: '2026-07-16', generatedAt: createdAt },
      createOccurrenceId: ({ childId }) => childId,
    });
    expect(suspended).toEqual([]);
  });

  it('refuse une plage de génération inversée', () => {
    expect(() => generateQuestOccurrences({
      schedule,
      children: [child35],
      existingOccurrences: [],
      generationRange: { fromDate: '2026-07-20', toDate: '2026-07-16', today: '2026-07-16', generatedAt: createdAt },
      createOccurrenceId: () => 'occ',
    })).toThrowError(DomainError);
  });

  it('rend disponibles les occurrences arrivées à échéance', () => {
    const upcoming = { ...generate()[1]!, status: 'upcoming' as const, localDate: '2026-07-17' };
    const released = releaseDueQuestOccurrences([upcoming], '2026-07-17', 'released');
    expect(released[0]).toMatchObject({ status: 'available', revision: 2 });
  });
});
