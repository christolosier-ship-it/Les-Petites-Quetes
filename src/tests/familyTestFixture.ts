import { createEmptyFamilyState, type FamilyState } from '../application/model/FamilyState';
import type { IdGenerator } from '../application/ports/IdGenerator';
import {
  addChildProfile,
  addCustomQuestTemplate,
  addQuestSchedule,
} from '../application/services/familySetupCommands';
import type { ValidationMode } from '../domain/shared/types';

export const TEST_NOW = '2026-07-16T12:00:00.000Z';
export const TEST_TODAY = '2026-07-16';

export class SequenceIds implements IdGenerator {
  private index = 0;

  next(): string {
    this.index += 1;
    return `test-id-${this.index}`;
  }
}

export function createFamilyWithQuest(
  validationMode: ValidationMode = 'parent',
): { readonly state: FamilyState; readonly ids: SequenceIds } {
  const ids = new SequenceIds();
  let state = addChildProfile(
    createEmptyFamilyState(),
    {
      displayName: 'Maddie',
      ageBand: '3-5',
      readingLevel: 'visual',
      avatarId: 'avatar.firefly',
      accentId: 'accent.sunrise',
      activeWorldId: 'world.firefly-forest',
    },
    TEST_NOW,
    ids,
  );
  const childId = state.children[0]!.id;
  const created = addCustomQuestTemplate(
    state,
    {
      title: 'Le petit rangement',
      instruction: 'Range trois jouets dans leur maison.',
      categoryId: 'autonomy',
      illustrationId: 'quest.autonomy',
      ageBands: ['3-5'],
      readingLevel: 'visual',
      estimatedMinutes: 5,
      steps: [{ id: 'step-1', instruction: 'Choisis trois jouets.' }],
      requiresAdultHelp: false,
      defaultValidation: validationMode,
      rewardDefinitionId: 'reward.lantern',
    },
    TEST_NOW,
    ids,
  );
  state = addQuestSchedule(
    created.state,
    {
      questTemplateId: created.questTemplateId,
      childIds: [childId],
      kind: 'immediate',
      startDate: TEST_TODAY,
      dayMoment: 'anytime',
      priority: 'required',
      validationMode,
    },
    TEST_NOW,
    TEST_TODAY,
    ids,
  );
  return { state, ids };
}
