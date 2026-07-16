import {
  FIREFLY_WORLD_ID,
  allRewards,
  allStoryChapters,
  chaptersForWorld,
  findRewardDefinition,
  findWorldDefinition,
  rewardsForWorld,
} from './worldCatalog';

export { FIREFLY_WORLD_ID, findRewardDefinition };
export const FIREFLY_WORLD_VERSION = findWorldDefinition(FIREFLY_WORLD_ID).version;
export const fireflyRewards = rewardsForWorld(FIREFLY_WORLD_ID);
export const fireflyChapters = chaptersForWorld(FIREFLY_WORLD_ID);
export { allRewards, allStoryChapters };
