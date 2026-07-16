import type { EntityMetadata } from '../shared/entity';
import type { ValidationMode } from '../shared/types';

export interface Completion extends EntityMetadata {
  readonly occurrenceId: string;
  readonly childId: string;
  readonly validationMode: ValidationMode;
  readonly validatedBy: 'child' | 'parent' | 'together';
  readonly completedAt: string;
  readonly rewardGrantId: string;
}

export type RewardKind =
  | 'resource'
  | 'decoration'
  | 'resident'
  | 'story-fragment'
  | 'badge';

export interface RewardDefinition {
  readonly id: string;
  readonly worldId: string;
  readonly kind: RewardKind;
  readonly assetId: string;
  readonly label: string;
  readonly description: string;
}

export interface RewardGrant extends EntityMetadata {
  readonly childId: string;
  readonly completionId: string;
  readonly rewardDefinitionId: string;
  readonly grantedAt: string;
}

export interface StoryChapter {
  readonly id: string;
  readonly worldId: string;
  readonly order: number;
  readonly title: string;
  readonly body: string;
  readonly illustrationId: string;
  readonly requiredCompletions: number;
}

export interface WorldProgress extends EntityMetadata {
  readonly childId: string;
  readonly worldId: string;
  readonly worldVersion: string;
  readonly stage: 0 | 1 | 2 | 3;
  readonly completionCount: number;
  readonly unlockedRewardIds: readonly string[];
  readonly unlockedStoryChapterIds: readonly string[];
  readonly lastCelebrationAt?: string;
}
