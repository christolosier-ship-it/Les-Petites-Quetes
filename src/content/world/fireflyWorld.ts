import type {
  RewardDefinition,
  StoryChapter,
} from '../../domain/progression/ProgressionTypes';

export const FIREFLY_WORLD_ID = 'world.firefly-forest';
export const FIREFLY_WORLD_VERSION = '1.0.0';

function reward(
  id: string,
  kind: RewardDefinition['kind'],
  label: string,
  description: string,
): RewardDefinition {
  return {
    id,
    worldId: FIREFLY_WORLD_ID,
    kind,
    assetId: 'reward.placeholder',
    label,
    description,
  };
}

export const fireflyRewards: readonly RewardDefinition[] = [
  reward('reward.lantern', 'decoration', 'Lanterne feuille', 'Une petite lumière rejoint le sentier.'),
  reward('reward.map', 'story-fragment', 'Fragment de carte', 'Un nouveau passage apparaît sur la carte.'),
  reward('reward.mushroom', 'decoration', 'Champignon lumineux', 'Un champignon éclaire le bord de la clairière.'),
  reward('reward.feather', 'resource', 'Plume dorée', 'Une plume légère danse près du grand arbre.'),
  reward('reward.bench', 'decoration', 'Banc des histoires', 'Le village possède maintenant un endroit pour se retrouver.'),
  reward('reward.firefly', 'resident', 'Luciole curieuse', 'Une nouvelle luciole vient habiter la forêt.'),
  reward('reward.flower', 'decoration', 'Fleur de lune', 'Une fleur douce s’ouvre près du refuge.'),
  reward('reward.star', 'resource', 'Éclat d’étoile', 'Un éclat brille au-dessus des branches.'),
  reward('reward.fox', 'resident', 'Renard veilleur', 'Un petit renard rejoint le chemin.'),
  reward('reward.hedgehog', 'resident', 'Hérisson jardinier', 'Un hérisson prépare un coin de mousse.'),
  reward('reward.book', 'badge', 'Livre des découvertes', 'Une page garde le souvenir de cette aventure.'),
  reward('reward.owl', 'resident', 'Chouette des sons', 'Une chouette écoute la forêt avec toi.'),
];

function chapter(
  order: number,
  title: string,
  body: string,
  requiredCompletions: number,
): StoryChapter {
  return {
    id: `story.firefly.${order}`,
    worldId: FIREFLY_WORLD_ID,
    order,
    title,
    body,
    illustrationId: `world.forest-stage-${Math.min(3, Math.floor(order / 3))}`,
    requiredCompletions,
  };
}

export const fireflyChapters: readonly StoryChapter[] = [
  chapter(1, 'La première lueur', 'Lumo découvre une luciole éveillée près du sentier.', 1),
  chapter(2, 'Le chemin murmure', 'Les feuilles bougent et révèlent une trace brillante.', 2),
  chapter(3, 'La clairière répond', 'Une lanterne s’allume au pied du grand arbre.', 4),
  chapter(4, 'Les nouveaux voisins', 'De petits habitants viennent regarder les lumières.', 6),
  chapter(5, 'Le village se dessine', 'Un banc et des fleurs transforment la clairière.', 8),
  chapter(6, 'La carte incomplète', 'Des fragments montrent un passage encore secret.', 10),
  chapter(7, 'La forêt illuminée', 'Les lucioles relient les maisons par des chemins dorés.', 12),
  chapter(8, 'La suite du sentier', 'Lumo sourit : la forêt peut encore grandir longtemps.', 16),
];

export function findRewardDefinition(id: string): RewardDefinition {
  const rewardDefinition = fireflyRewards.find((candidate) => candidate.id === id);
  if (!rewardDefinition) throw new Error(`Récompense inconnue : ${id}`);
  return rewardDefinition;
}
