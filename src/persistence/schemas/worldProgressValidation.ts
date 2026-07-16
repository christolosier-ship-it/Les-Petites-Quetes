import type { FamilyState } from '../../application/model/FamilyState';
import {
  FIREFLY_WORLD_ID,
  fireflyChapters,
  fireflyRewards,
} from '../../content/world/fireflyWorld';

function stageForCount(count: number): 0 | 1 | 2 | 3 {
  if (count >= 12) return 3;
  if (count >= 6) return 2;
  if (count >= 2) return 1;
  return 0;
}

function sameValues(left: readonly string[], right: readonly string[]): boolean {
  return [...left].sort().join('|') === [...right].sort().join('|');
}

export function assertWorldProgress(state: FamilyState): void {
  const childIds = new Set(state.children.map((child) => child.id));
  const seenWorlds = new Set<string>();
  const rewardDefinitions = new Set(fireflyRewards.map((reward) => reward.id));

  for (const progress of state.worldProgress) {
    if (!childIds.has(progress.childId)) {
      throw new Error('Une progression référence un enfant inconnu.');
    }
    if (progress.worldId !== FIREFLY_WORLD_ID) {
      throw new Error('Une progression utilise un univers inconnu.');
    }
    const worldKey = `${progress.childId}:${progress.worldId}`;
    if (seenWorlds.has(worldKey)) {
      throw new Error('Un enfant possède plusieurs progressions pour le même monde.');
    }
    seenWorlds.add(worldKey);

    const grants = state.rewardGrants.filter(
      (grant) => grant.childId === progress.childId &&
        rewardDefinitions.has(grant.rewardDefinitionId),
    );
    const expectedRewards = [...new Set(grants.map((grant) => grant.rewardDefinitionId))];
    const expectedChapters = fireflyChapters
      .filter((chapter) => chapter.requiredCompletions <= grants.length)
      .map((chapter) => chapter.id);

    if (progress.completionCount !== grants.length || progress.stage !== stageForCount(grants.length)) {
      throw new Error('La progression enregistrée ne correspond pas aux récompenses attribuées.');
    }
    if (!sameValues(progress.unlockedRewardIds, expectedRewards)) {
      throw new Error('Les récompenses débloquées ne correspondent pas à l’historique.');
    }
    if (!sameValues(progress.unlockedStoryChapterIds, expectedChapters)) {
      throw new Error('Les chapitres débloqués ne correspondent pas à l’historique.');
    }
  }
}
