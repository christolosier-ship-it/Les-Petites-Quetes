import type { QuestFamilySeed } from '../QuestFamily';
import { SPACE_WORLD_ID } from '../../world/worldCatalog';

export const spaceQuestFamilies: readonly QuestFamilySeed[] = [
  {
    id: 'family.day.prepare-bag', worldId: SPACE_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.space.prepare-bag', rewardDefinitionId: 'reward.space-station.star-map', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'Le sac de mission', instruction: 'Mets ta gourde dans ton sac.', readingLevel: 'visual', estimatedMinutes: 4 },
      '6-8': { title: 'Le sac de mission', instruction: 'Prépare ta gourde et les affaires demandées pour la sortie.', readingLevel: 'short-text', estimatedMinutes: 7 },
      '9-10': { title: 'Le module de départ', instruction: 'Vérifie la liste de sortie et organise les affaires utiles dans ton sac.', readingLevel: 'independent', estimatedMinutes: 10 },
    },
  },
  {
    id: 'family.day.shoes-coat', worldId: SPACE_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.space.shoes', rewardDefinitionId: 'reward.space-station.module', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'La combinaison spatiale', instruction: 'Mets tes chaussures et ton manteau.', readingLevel: 'visual', estimatedMinutes: 5 },
      '6-8': { title: 'La combinaison de sortie', instruction: 'Choisis tes chaussures et ton vêtement selon la météo.', readingLevel: 'short-text', estimatedMinutes: 6 },
      '9-10': { title: 'L’équipement extérieur', instruction: 'Prépare une tenue adaptée au lieu, au temps et à la durée de sortie.', readingLevel: 'independent', estimatedMinutes: 8 },
    },
  },
  {
    id: 'family.day.water', worldId: SPACE_WORLD_ID, categoryId: 'wellbeing', illustrationId: 'quest.space.water', rewardDefinitionId: 'reward.space-station.crystal', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'Le carburant de Nova', instruction: 'Prends quelques gorgées d’eau.', readingLevel: 'visual', estimatedMinutes: 2 },
      '6-8': { title: 'La réserve de la station', instruction: 'Remplis ta gourde et bois quelques gorgées avant le départ.', readingLevel: 'short-text', estimatedMinutes: 4 },
      '9-10': { title: 'Le contrôle des réserves', instruction: 'Vérifie ta gourde et prévois assez d’eau pour la sortie.', readingLevel: 'independent', estimatedMinutes: 4 },
    },
  },
  {
    id: 'family.day.safety-check', worldId: SPACE_WORLD_ID, categoryId: 'special-adventure', illustrationId: 'quest.space.safety', rewardDefinitionId: 'reward.space-station.antenna', requiresAdultHelp: true, defaultValidation: 'together',
    variants: {
      '3-5': { title: 'Le contrôle avant départ', instruction: 'Avec un adulte, regarde où tu vas.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'Le briefing de mission', instruction: 'Avec un adulte, rappelle le lieu et les règles de sortie.', readingLevel: 'short-text', estimatedMinutes: 5 },
      '9-10': { title: 'Le plan de mission', instruction: 'Vérifie avec un adulte le trajet, les horaires et les consignes importantes.', readingLevel: 'independent', estimatedMinutes: 6 },
    },
  },
  {
    id: 'family.day.return-home', worldId: SPACE_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.space.return', rewardDefinitionId: 'reward.space-station.bot', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'Le retour à la base', instruction: 'Range tes chaussures à leur place.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'Le sas de retour', instruction: 'Range chaussures, manteau et sac dans leurs emplacements.', readingLevel: 'short-text', estimatedMinutes: 6 },
      '9-10': { title: 'La remise en ordre du module', instruction: 'Vide les affaires utiles, range ton équipement et signale ce qui manque.', readingLevel: 'independent', estimatedMinutes: 8 },
    },
  },
];
