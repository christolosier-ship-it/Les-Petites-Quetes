import type { QuestOccurrence } from '../completion/QuestOccurrenceTypes';
import { createEntityMetadata, incrementRevision } from '../shared/entity';
import { assertDomain } from '../shared/errors';
import { requireIdentifier, requireText } from '../shared/validation';
import type { ValidationMode } from '../shared/types';
import type {
  Completion,
  RewardDefinition,
  RewardGrant,
  StoryChapter,
  WorldProgress,
} from './ProgressionTypes';

interface EntityIdentity {
  readonly id: string;
  readonly createdAt: string;
}

export function createCompletion(
  occurrence: QuestOccurrence,
  validationMode: ValidationMode,
  validatedBy: Completion['validatedBy'],
  rewardGrantId: string,
  identity: EntityIdentity,
): Completion {
  assertDomain(
    occurrence.deletedAt === undefined && occurrence.status === 'completed',
    'progression.occurrence-not-completed',
    'Une récompense nécessite une occurrence terminée.',
  );
  return {
    ...createEntityMetadata(identity.id, identity.createdAt),
    occurrenceId: occurrence.id,
    childId: occurrence.childId,
    validationMode,
    validatedBy,
    completedAt: requireText(
      occurrence.completedAt ?? identity.createdAt,
      'progression.timestamp-required',
      'Un instant de réalisation est requis.',
      'completedAt',
    ),
    rewardGrantId: requireIdentifier(
      rewardGrantId,
      'progression.identifier-required',
      'Un identifiant de récompense attribuée est requis.',
      'rewardGrantId',
    ),
  };
}

export function createRewardGrant(
  completion: Completion,
  rewardDefinition: RewardDefinition,
  identity: EntityIdentity,
): RewardGrant {
  assertDomain(
    completion.deletedAt === undefined,
    'progression.completion-deleted',
    'Une réalisation supprimée ne peut produire de récompense.',
  );
  return {
    ...createEntityMetadata(identity.id, identity.createdAt),
    childId: completion.childId,
    completionId: completion.id,
    rewardDefinitionId: requireIdentifier(
      rewardDefinition.id,
      'progression.identifier-required',
      'Une définition de récompense est requise.',
      'rewardDefinitionId',
    ),
    grantedAt: identity.createdAt,
  };
}

function stageForCount(completionCount: number): WorldProgress['stage'] {
  if (completionCount >= 12) return 3;
  if (completionCount >= 6) return 2;
  if (completionCount >= 2) return 1;
  return 0;
}

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

export function rebuildWorldProgress(input: {
  readonly childId: string;
  readonly worldId: string;
  readonly worldVersion: string;
  readonly grants: readonly RewardGrant[];
  readonly rewards: readonly RewardDefinition[];
  readonly chapters: readonly StoryChapter[];
  readonly existing?: WorldProgress;
  readonly identity: EntityIdentity;
  readonly celebrationAt?: string;
}): WorldProgress {
  const childId = requireIdentifier(
    input.childId,
    'progression.identifier-required',
    'Un enfant est requis pour calculer le monde.',
    'childId',
  );
  const worldRewards = new Map(
    input.rewards.filter((reward) => reward.worldId === input.worldId).map((reward) => [reward.id, reward]),
  );
  const validGrants = input.grants.filter(
    (grant) =>
      grant.deletedAt === undefined &&
      grant.childId === childId &&
      worldRewards.has(grant.rewardDefinitionId),
  );
  const unlockedRewardIds = unique(validGrants.map((grant) => grant.rewardDefinitionId));
  const unlockedStoryChapterIds = input.chapters
    .filter(
      (chapter) =>
        chapter.worldId === input.worldId &&
        chapter.requiredCompletions <= validGrants.length,
    )
    .sort((left, right) => left.order - right.order)
    .map((chapter) => chapter.id);
  const metadata = input.existing
    ? incrementRevision(input.existing, input.identity.createdAt)
    : createEntityMetadata(input.identity.id, input.identity.createdAt);

  return {
    ...metadata,
    childId,
    worldId: requireIdentifier(
      input.worldId,
      'progression.identifier-required',
      'Un univers est requis.',
      'worldId',
    ),
    worldVersion: requireText(
      input.worldVersion,
      'progression.world-version-required',
      'Une version d’univers est requise.',
      'worldVersion',
    ),
    stage: stageForCount(validGrants.length),
    completionCount: validGrants.length,
    unlockedRewardIds,
    unlockedStoryChapterIds,
    ...(input.celebrationAt !== undefined
      ? { lastCelebrationAt: input.celebrationAt }
      : input.existing?.lastCelebrationAt !== undefined
        ? { lastCelebrationAt: input.existing.lastCelebrationAt }
        : {}),
  };
}
