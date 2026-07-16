import { describe, expect, it } from 'vitest';
import type { QuestOccurrence } from '../completion/QuestOccurrenceTypes';
import { DomainError } from '../shared/errors';
import { createCompletion, createRewardGrant, rebuildWorldProgress } from './QuestProgression';
import type { RewardDefinition, StoryChapter } from './ProgressionTypes';

const occurrence: QuestOccurrence = { id: 'occ-1', scheduleId: 'schedule-1', questTemplateId: 'family.test.3-5', questFamilyId: 'family.test', worldId: 'world.firefly-forest', childId: 'child-1', localDate: '2026-07-16', dayMoment: 'morning', status: 'completed', completedAt: '2026-07-16T08:00:00.000Z', createdAt: 'created', updatedAt: 'completed', revision: 2 };
const rewards: readonly RewardDefinition[] = [{ id: 'reward.lantern', worldId: 'world.firefly-forest', kind: 'decoration', assetId: 'reward.placeholder', label: 'Lanterne', description: 'Une petite lumière rejoint la clairière.' }];
const chapters: readonly StoryChapter[] = [{ id: 'chapter.1', worldId: 'world.firefly-forest', order: 1, title: 'La première lumière', body: 'Une luciole ouvre les yeux dans la clairière.', illustrationId: 'world.forest-stage-1', requiredCompletions: 1 }];

describe('progression', () => {
  it('crée une réalisation et une récompense reliées une seule fois', () => {
    const completion = createCompletion(occurrence, 'parent', 'parent', 'grant-1', { id: 'completion-1', createdAt: occurrence.completedAt! });
    const grant = createRewardGrant(completion, rewards[0]!, { id: 'grant-1', createdAt: occurrence.completedAt! });
    expect(completion).toMatchObject({ occurrenceId: 'occ-1', rewardGrantId: 'grant-1' });
    expect(grant).toMatchObject({ completionId: 'completion-1', rewardDefinitionId: 'reward.lantern' });
  });
  it('refuse de récompenser une occurrence non terminée', () => {
    const { completedAt, ...withoutCompletionDate } = occurrence;
    void completedAt;
    expect(() => createCompletion({ ...withoutCompletionDate, status: 'available' }, 'parent', 'parent', 'grant-1', { id: 'completion-1', createdAt: 'now' })).toThrowError(DomainError);
  });
  it('reconstruit le monde depuis les récompenses sans dépendre d’une série', () => {
    const completion = createCompletion(occurrence, 'parent', 'parent', 'grant-1', { id: 'completion-1', createdAt: occurrence.completedAt! });
    const grant = createRewardGrant(completion, rewards[0]!, { id: 'grant-1', createdAt: occurrence.completedAt! });
    const progress = rebuildWorldProgress({ childId: 'child-1', worldId: 'world.firefly-forest', worldVersion: '3.0.0', grants: [grant], rewards, chapters, identity: { id: 'progress-1', createdAt: 'now' }, celebrationAt: 'now' });
    expect(progress).toMatchObject({ completionCount: 1, unlockedRewardIds: ['reward.lantern'], unlockedStoryChapterIds: ['chapter.1'], stage: 0 });
  });
  it('fait évoluer quatre états sans retirer les anciens objets', () => {
    const grants = Array.from({ length: 12 }, (_, index) => ({ id: `grant-${index}`, childId: 'child-1', completionId: `completion-${index}`, rewardDefinitionId: 'reward.lantern', grantedAt: 'now', createdAt: 'now', updatedAt: 'now', revision: 1 }));
    const progress = rebuildWorldProgress({ childId: 'child-1', worldId: 'world.firefly-forest', worldVersion: '3.0.0', grants, rewards, chapters, identity: { id: 'progress-1', createdAt: 'now' } });
    expect(progress).toMatchObject({ stage: 3, completionCount: 12, unlockedRewardIds: ['reward.lantern'] });
  });
});
