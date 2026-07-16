import type { RewardDefinition, StoryChapter } from '../../domain/progression/ProgressionTypes';
import type { WorldDefinition, WorldId } from '../../domain/world/WorldDefinition';

export const FIREFLY_WORLD_ID: WorldId = 'world.firefly-forest';
export const DRAGON_WORLD_ID: WorldId = 'world.dragon-mountain';
export const SPACE_WORLD_ID: WorldId = 'world.space-station';
export const GNOME_WORLD_ID: WorldId = 'world.gnome-village';
export const NATURE_WORLD_ID: WorldId = 'world.nature-discovery';
export const CREATIVITY_WORLD_ID: WorldId = 'world.creativity-workshop';

const VERSION = '3.0.0';

function stages(prefix: string): readonly [string, string, string, string] {
  return [0, 1, 2, 3].map((stage) => `world.${prefix}-stage-${stage}`) as unknown as readonly [string, string, string, string];
}

export const worldCatalog: readonly WorldDefinition[] = [
  { id: FIREFLY_WORLD_ID, slug: 'firefly-forest', name: 'La Forêt des Lucioles', shortName: 'Forêt', focus: 'soirée, calme et coucher', mascotId: 'mascot.luma', mascotName: 'Luma', coverAssetId: 'world.firefly-forest-cover', stageAssetIds: stages('firefly-forest'), version: VERSION },
  { id: DRAGON_WORLD_ID, slug: 'dragon-mountain', name: 'La Montagne du Dragon', shortName: 'Montagne', focus: 'réveil et routines du matin', mascotId: 'mascot.flammeche', mascotName: 'Flammèche', coverAssetId: 'world.dragon-mountain-cover', stageAssetIds: stages('dragon-mountain'), version: VERSION },
  { id: SPACE_WORLD_ID, slug: 'space-station', name: 'La Station Spatiale', shortName: 'Station', focus: 'sorties et défis de journée', mascotId: 'mascot.nova', mascotName: 'Nova', coverAssetId: 'world.space-station-cover', stageAssetIds: stages('space-station'), version: VERSION },
  { id: GNOME_WORLD_ID, slug: 'gnome-village', name: 'Le Village des Lutins', shortName: 'Village', focus: 'école, lecture et organisation', mascotId: 'mascot.pico', mascotName: 'Pico', coverAssetId: 'world.gnome-village-cover', stageAssetIds: stages('gnome-village'), version: VERSION },
  { id: NATURE_WORLD_ID, slug: 'nature-discovery', name: 'Nature et découvertes', shortName: 'Nature', focus: 'jardin, animaux et observation', mascotId: 'mascot.brindille', mascotName: 'Brindille', coverAssetId: 'world.nature-discovery-cover', stageAssetIds: stages('nature-discovery'), version: VERSION },
  { id: CREATIVITY_WORLD_ID, slug: 'creativity-workshop', name: 'L’Atelier créatif', shortName: 'Atelier', focus: 'dessin, musique et imagination', mascotId: 'mascot.mimo', mascotName: 'Mimo', coverAssetId: 'world.creativity-workshop-cover', stageAssetIds: stages('creativity-workshop'), version: VERSION },
];

function reward(worldId: WorldId, suffix: string, kind: RewardDefinition['kind'], label: string, description: string): RewardDefinition {
  return { id: `reward.${worldId.slice(6)}.${suffix}`, worldId, kind, assetId: `reward.${worldId.slice(6)}.${suffix}`, label, description };
}

const fireflyRewards: readonly RewardDefinition[] = [
  { id: 'reward.lantern', worldId: FIREFLY_WORLD_ID, kind: 'decoration', assetId: 'reward.firefly-forest.lantern', label: 'Lanterne feuille', description: 'Une petite lumière rejoint le sentier.' },
  { id: 'reward.map', worldId: FIREFLY_WORLD_ID, kind: 'story-fragment', assetId: 'reward.firefly-forest.map', label: 'Fragment de carte', description: 'Un nouveau passage apparaît sur la carte.' },
  { id: 'reward.mushroom', worldId: FIREFLY_WORLD_ID, kind: 'decoration', assetId: 'reward.firefly-forest.mushroom', label: 'Champignon lumineux', description: 'Un champignon éclaire la clairière.' },
  { id: 'reward.feather', worldId: FIREFLY_WORLD_ID, kind: 'resource', assetId: 'reward.firefly-forest.feather', label: 'Plume dorée', description: 'Une plume danse près du grand arbre.' },
  { id: 'reward.bench', worldId: FIREFLY_WORLD_ID, kind: 'decoration', assetId: 'reward.firefly-forest.bench', label: 'Banc des histoires', description: 'Un endroit apparaît pour raconter les aventures.' },
  { id: 'reward.firefly', worldId: FIREFLY_WORLD_ID, kind: 'resident', assetId: 'reward.firefly-forest.firefly', label: 'Luciole curieuse', description: 'Une nouvelle luciole rejoint Luma.' },
  { id: 'reward.flower', worldId: FIREFLY_WORLD_ID, kind: 'decoration', assetId: 'reward.firefly-forest.flower', label: 'Fleur de lune', description: 'Une fleur douce s’ouvre près du refuge.' },
  { id: 'reward.star', worldId: FIREFLY_WORLD_ID, kind: 'resource', assetId: 'reward.firefly-forest.star', label: 'Éclat d’étoile', description: 'Un éclat brille au-dessus des branches.' },
  { id: 'reward.fox', worldId: FIREFLY_WORLD_ID, kind: 'resident', assetId: 'reward.firefly-forest.fox', label: 'Renard veilleur', description: 'Un petit renard rejoint le chemin.' },
  { id: 'reward.hedgehog', worldId: FIREFLY_WORLD_ID, kind: 'resident', assetId: 'reward.firefly-forest.hedgehog', label: 'Hérisson jardinier', description: 'Un hérisson prépare un coin de mousse.' },
  { id: 'reward.book', worldId: FIREFLY_WORLD_ID, kind: 'badge', assetId: 'reward.firefly-forest.book', label: 'Livre des découvertes', description: 'Une page garde le souvenir de cette aventure.' },
  { id: 'reward.owl', worldId: FIREFLY_WORLD_ID, kind: 'resident', assetId: 'reward.firefly-forest.owl', label: 'Chouette des sons', description: 'Une chouette écoute la forêt avec toi.' },
];

const generatedRewards: readonly RewardDefinition[] = [
  reward(DRAGON_WORLD_ID, 'sunstone', 'resource', 'Pierre de soleil', 'La montagne gagne une nouvelle lueur.'),
  reward(DRAGON_WORLD_ID, 'flag', 'decoration', 'Fanion du sommet', 'Un fanion flotte près du refuge.'),
  reward(DRAGON_WORLD_ID, 'goat', 'resident', 'Chèvre des crêtes', 'Une petite chèvre rejoint Flammèche.'),
  reward(DRAGON_WORLD_ID, 'bridge', 'decoration', 'Pont des nuages', 'Un passage relie deux rochers.'),
  reward(DRAGON_WORLD_ID, 'scale', 'story-fragment', 'Écaille dorée', 'Une ancienne histoire de dragon se révèle.'),
  reward(SPACE_WORLD_ID, 'star-map', 'story-fragment', 'Carte stellaire', 'Une nouvelle route apparaît dans la station.'),
  reward(SPACE_WORLD_ID, 'module', 'decoration', 'Module d’observation', 'Une salle s’allume près du hublot.'),
  reward(SPACE_WORLD_ID, 'bot', 'resident', 'Petit robot', 'Un assistant rejoint Nova.'),
  reward(SPACE_WORLD_ID, 'crystal', 'resource', 'Cristal cosmique', 'Le réacteur gagne une étincelle colorée.'),
  reward(SPACE_WORLD_ID, 'antenna', 'decoration', 'Antenne des messages', 'La station capte un signal amical.'),
  reward(GNOME_WORLD_ID, 'book', 'story-fragment', 'Livre minuscule', 'Une page rejoint la bibliothèque des lutins.'),
  reward(GNOME_WORLD_ID, 'desk', 'decoration', 'Petit bureau', 'Un coin de travail apparaît dans l’école.'),
  reward(GNOME_WORLD_ID, 'gnome', 'resident', 'Lutin messager', 'Un nouveau lutin rejoint Pico.'),
  reward(GNOME_WORLD_ID, 'pencil', 'resource', 'Crayon enchanté', 'Un crayon lumineux entre dans la trousse.'),
  reward(GNOME_WORLD_ID, 'bell', 'decoration', 'Cloche des découvertes', 'Une cloche tinte au centre du village.'),
  reward(NATURE_WORLD_ID, 'seed', 'resource', 'Graine curieuse', 'Une pousse apparaît dans le jardin.'),
  reward(NATURE_WORLD_ID, 'nest', 'decoration', 'Nid douillet', 'Un nouvel abri se construit dans les branches.'),
  reward(NATURE_WORLD_ID, 'squirrel', 'resident', 'Écureuil observateur', 'Un écureuil rejoint Brindille.'),
  reward(NATURE_WORLD_ID, 'magnifier', 'badge', 'Loupe d’exploration', 'La collection de découvertes s’agrandit.'),
  reward(NATURE_WORLD_ID, 'pond', 'decoration', 'Petite mare', 'Une mare accueille de nouvelles traces de vie.'),
  reward(CREATIVITY_WORLD_ID, 'paint', 'resource', 'Couleur nouvelle', 'Une couleur rejoint la grande palette.'),
  reward(CREATIVITY_WORLD_ID, 'stage', 'decoration', 'Petite scène', 'Un espace apparaît pour montrer les créations.'),
  reward(CREATIVITY_WORLD_ID, 'paper-bird', 'resident', 'Oiseau de papier', 'Un oiseau inventé rejoint Mimo.'),
  reward(CREATIVITY_WORLD_ID, 'melody', 'story-fragment', 'Mélodie secrète', 'Quelques notes ouvrent une nouvelle histoire.'),
  reward(CREATIVITY_WORLD_ID, 'toolbox', 'decoration', 'Boîte à idées', 'De nouveaux outils attendent la prochaine création.'),
];

export const allRewards: readonly RewardDefinition[] = [...fireflyRewards, ...generatedRewards];

const chapterTitles = ['Le premier signe', 'Le passage s’ouvre', 'Un nouvel ami', 'Le refuge grandit', 'La carte change', 'Le grand rassemblement', 'Le monde rayonne', 'La suite de l’aventure'];

export const allStoryChapters: readonly StoryChapter[] = worldCatalog.flatMap((world) =>
  chapterTitles.map((title, index) => ({
    id: `story.${world.slug}.${index + 1}`,
    worldId: world.id,
    order: index + 1,
    title,
    body: `${world.mascotName} découvre une nouvelle étape liée à ${world.focus}.`,
    illustrationId: world.stageAssetIds[Math.min(3, Math.floor(index / 2))],
    requiredCompletions: [1, 2, 4, 6, 8, 10, 12, 16][index]!,
  })),
);

export function findWorldDefinition(id: string): WorldDefinition {
  const world = worldCatalog.find((candidate) => candidate.id === id);
  if (!world) throw new Error(`Univers inconnu : ${id}`);
  return world;
}

export function findRewardDefinition(id: string): RewardDefinition {
  const definition = allRewards.find((candidate) => candidate.id === id);
  if (!definition) throw new Error(`Récompense inconnue : ${id}`);
  return definition;
}

export function rewardsForWorld(worldId: WorldId): readonly RewardDefinition[] {
  return allRewards.filter((rewardDefinition) => rewardDefinition.worldId === worldId);
}

export function chaptersForWorld(worldId: WorldId): readonly StoryChapter[] {
  return allStoryChapters.filter((chapter) => chapter.worldId === worldId);
}

export function defaultRewardForWorld(worldId: WorldId): string {
  return rewardsForWorld(worldId)[0]!.id;
}
