import { describe, expect, it } from 'vitest';
import { avatarCatalog } from '../avatars/avatarCatalog';
import { allRewards, allStoryChapters, findRewardDefinition, findWorldDefinition, worldCatalog } from './worldCatalog';

describe('catalogue des univers', () => {
  it('déclare exactement six univers avec des identifiants uniques', () => {
    expect(worldCatalog).toHaveLength(6);
    expect(new Set(worldCatalog.map((world) => world.id)).size).toBe(6);
    expect(new Set(worldCatalog.map((world) => world.mascotId)).size).toBe(6);
    for (const world of worldCatalog) {
      expect(world.stageAssetIds).toHaveLength(4);
      expect(findWorldDefinition(world.id)).toBe(world);
    }
  });

  it('déclare une fille et un garçon pour chaque tranche d’âge', () => {
    expect(avatarCatalog).toHaveLength(6);
    for (const ageBand of ['3-5', '6-8', '9-10'] as const) {
      expect(avatarCatalog.filter((avatar) => avatar.ageBand === ageBand).map((avatar) => avatar.presentation).sort()).toEqual(['boy', 'girl']);
    }
  });

  it('rattache chaque récompense et chaque chapitre à un univers existant', () => {
    const worldIds = new Set(worldCatalog.map((world) => world.id));
    expect(allRewards.length).toBeGreaterThanOrEqual(37);
    expect(allStoryChapters).toHaveLength(48);
    for (const reward of allRewards) {
      expect(worldIds.has(reward.worldId)).toBe(true);
      expect(findRewardDefinition(reward.id)).toBe(reward);
    }
    for (const chapter of allStoryChapters) expect(worldIds.has(chapter.worldId)).toBe(true);
  });
});
