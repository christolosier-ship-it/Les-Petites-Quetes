import { describe, expect, it } from 'vitest';
import { createChildProfile, archiveChildProfile, type ChildProfile } from '../child/ChildProfile';
import type { QuestOccurrence } from '../completion/QuestOccurrenceTypes';
import { DomainError, type DomainErrorCode } from '../shared/errors';
import { createQuestSchedule, suspendQuestSchedule } from './QuestSchedule';
import {
  generateQuestOccurrences,
  releaseDueQuestOccurrences,
  type OccurrenceIdentitySeed,
} from './OccurrenceGeneration';

function child(id: string): ChildProfile {
  return createChildProfile(
    {
      displayName: id,
      ageBand: '3-5',
      readingLevel: 'visual',
      avatarId: 'avatar.firefly',
      accentId: 'accent.sunrise',
      activeWorldId: 'world.firefly-forest',
    },
    { id, createdAt: '2026-07-16T07:00:00.000Z' },
  );
}

function weeklySchedule() {
  return createQuestSchedule(
    {
      questTemplateId: 'quest.brush-teeth',
      childIds: ['child-1', 'child-2'],
      kind: 'weekly',
      startDate: '2026-07-16',
      endDate: '2026-07-31',
      weekdays: ['mon', 'thu'],
      dayMoment: 'morning',
      priority: 'required',
      validationMode: 'parent',
    },
    { id: 'schedule-1', createdAt: '2026-07-16T07:00:00.000Z' },
  );
}

function occurrence(overrides: Partial<QuestOccurrence> = {}): QuestOccurrence {
  return {
    id: 'occurrence-existing',
    scheduleId: 'schedule-1',
    questTemplateId: 'quest.brush-teeth',
    childId: 'child-1',
    localDate: '2026-07-16',
    dayMoment: 'morning',
    status: 'available',
    createdAt: '2026-07-16T07:00:00.000Z',
    updatedAt: '2026-07-16T07:00:00.000Z',
    revision: 1,
    ...overrides,
  };
}

function createId(seed: OccurrenceIdentitySeed): string {
  return `occ-${seed.childId}-${seed.localDate}`;
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

describe('génération des occurrences', () => {
  it('génère les jours attendus pour chaque enfant avec un statut temporel neutre', () => {
    const generated = generateQuestOccurrences({
      schedule: weeklySchedule(),
      children: [child('child-1'), child('child-2')],
      existingOccurrences: [],
      generationRange: {
        fromDate: '2026-07-16',
        toDate: '2026-07-23',
        today: '2026-07-18',
        generatedAt: '2026-07-16T08:00:00.000Z',
      },
      createOccurrenceId: createId,
    });

    expect(generated).toHaveLength(6);
    expect(generated.map((item) => `${item.childId}:${item.localDate}`)).toEqual([
      'child-1:2026-07-16',
      'child-1:2026-07-20',
      'child-1:2026-07-23',
      'child-2:2026-07-16',
      'child-2:2026-07-20',
      'child-2:2026-07-23',
    ]);
    expect(generated.filter((item) => item.status === 'available')).toHaveLength(2);
    expect(generated.filter((item) => item.status === 'upcoming')).toHaveLength(4);
  });

  it('ne recrée aucune occurrence déjà connue, quel que soit son état', () => {
    const first = generateQuestOccurrences({
      schedule: weeklySchedule(),
      children: [child('child-1'), child('child-2')],
      existingOccurrences: [],
      generationRange: {
        fromDate: '2026-07-16',
        toDate: '2026-07-16',
        today: '2026-07-16',
        generatedAt: 'generated',
      },
      createOccurrenceId: createId,
    });
    const terminal = { ...first[0]!, status: 'completed' as const };
    const tombstone = { ...first[1]!, deletedAt: 'deleted' };

    expect(
      generateQuestOccurrences({
        schedule: weeklySchedule(),
        children: [child('child-1'), child('child-2')],
        existingOccurrences: [terminal, tombstone],
        generationRange: {
          fromDate: '2026-07-16',
          toDate: '2026-07-16',
          today: '2026-07-16',
          generatedAt: 'again',
        },
        createOccurrenceId: createId,
      }),
    ).toEqual([]);
  });

  it('ignore une planification suspendue et les profils archivés ou supprimés', () => {
    const archived = archiveChildProfile(child('child-1'), 'archived');
    const deleted = { ...child('child-2'), deletedAt: 'deleted' };
    const input = {
      children: [archived, deleted],
      existingOccurrences: [],
      generationRange: {
        fromDate: '2026-07-16',
        toDate: '2026-07-23',
        today: '2026-07-16',
        generatedAt: 'generated',
      },
      createOccurrenceId: createId,
    } as const;

    expect(generateQuestOccurrences({ ...input, schedule: weeklySchedule() })).toEqual([]);
    expect(
      generateQuestOccurrences({
        ...input,
        schedule: suspendQuestSchedule(weeklySchedule(), 'suspended'),
      }),
    ).toEqual([]);
  });

  it('signale un enfant manquant au lieu de perdre silencieusement une attribution', () => {
    expectDomainError(
      () =>
        generateQuestOccurrences({
          schedule: weeklySchedule(),
          children: [child('child-1')],
          existingOccurrences: [],
          generationRange: {
            fromDate: '2026-07-16',
            toDate: '2026-07-16',
            today: '2026-07-16',
            generatedAt: 'generated',
          },
          createOccurrenceId: createId,
        }),
      'occurrence.child-not-found',
    );
  });

  it('refuse une plage inversée pour tous les types de planification', () => {
    expectDomainError(
      () =>
        generateQuestOccurrences({
          schedule: weeklySchedule(),
          children: [child('child-1'), child('child-2')],
          existingOccurrences: [],
          generationRange: {
            fromDate: '2026-07-20',
            toDate: '2026-07-16',
            today: '2026-07-16',
            generatedAt: 'generated',
          },
          createOccurrenceId: createId,
        }),
      'occurrence.invalid-generation-range',
    );
  });

  it('refuse une collision d’identifiant même entre deux dates différentes', () => {
    expectDomainError(
      () =>
        generateQuestOccurrences({
          schedule: weeklySchedule(),
          children: [child('child-1'), child('child-2')],
          existingOccurrences: [],
          generationRange: {
            fromDate: '2026-07-16',
            toDate: '2026-07-20',
            today: '2026-07-16',
            generatedAt: 'generated',
          },
          createOccurrenceId: () => 'same-id',
        }),
      'occurrence.id-collision',
    );
  });

  it('rend disponibles uniquement les occurrences arrivées à échéance', () => {
    const future = occurrence({ id: 'future', localDate: '2026-07-20', status: 'upcoming' });
    const due = occurrence({ id: 'due', localDate: '2026-07-16', status: 'upcoming' });
    const completed = occurrence({ id: 'completed', status: 'completed' });
    const deleted = occurrence({ id: 'deleted', status: 'upcoming', deletedAt: 'deleted' });
    const released = releaseDueQuestOccurrences(
      [future, due, completed, deleted],
      '2026-07-16',
      '2026-07-16T08:00:00.000Z',
    );

    expect(released[0]).toBe(future);
    expect(released[1]).toMatchObject({ status: 'available', revision: 2 });
    expect(released[2]).toBe(completed);
    expect(released[3]).toBe(deleted);
    expect(releaseDueQuestOccurrences(released, '2026-07-16', 'later')[1]).toBe(released[1]);
  });
});
