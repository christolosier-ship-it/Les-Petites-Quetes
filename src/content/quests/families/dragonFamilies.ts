import type { QuestFamilySeed } from '../QuestFamily';
import { DRAGON_WORLD_ID } from '../../world/worldCatalog';

export const dragonQuestFamilies: readonly QuestFamilySeed[] = [
  {
    id: 'family.morning.dress', worldId: DRAGON_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.dragon.dress', rewardDefinitionId: 'reward.dragon-mountain.sunstone', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'L’armure du matin', instruction: 'Choisis tes habits et habille-toi.', readingLevel: 'visual', estimatedMinutes: 8 },
      '6-8': { title: 'L’armure du sommet', instruction: 'Habille-toi avec les vêtements préparés pour ta journée.', readingLevel: 'short-text', estimatedMinutes: 8 },
      '9-10': { title: 'L’équipement du grimpeur', instruction: 'Choisis une tenue adaptée à la météo et prépare-toi sans oublier les détails.', readingLevel: 'independent', estimatedMinutes: 10 },
    },
  },
  {
    id: 'family.morning.brush-teeth', worldId: DRAGON_WORLD_ID, categoryId: 'hygiene-routine', illustrationId: 'quest.dragon.brush-teeth', rewardDefinitionId: 'reward.dragon-mountain.scale', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'Les crocs du dragon', instruction: 'Brosse doucement toutes tes dents.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'Les crocs du dragon', instruction: 'Brosse tes dents du haut puis celles du bas.', readingLevel: 'short-text', estimatedMinutes: 3 },
      '9-10': { title: 'Le soin des crocs', instruction: 'Brosse toutes les faces de tes dents et range ton matériel.', readingLevel: 'independent', estimatedMinutes: 4 },
    },
  },
  {
    id: 'family.morning.make-bed', worldId: DRAGON_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.dragon.make-bed', rewardDefinitionId: 'reward.dragon-mountain.flag', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'Le nid du dragon', instruction: 'Remonte ta couverture sur ton lit.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'Le refuge bien préparé', instruction: 'Remets ta couverture et ton oreiller à leur place.', readingLevel: 'short-text', estimatedMinutes: 5 },
      '9-10': { title: 'Le camp de base', instruction: 'Aère rapidement ton lit puis remets proprement couverture et oreiller.', readingLevel: 'independent', estimatedMinutes: 6 },
    },
  },
  {
    id: 'family.morning.breakfast', worldId: DRAGON_WORLD_ID, categoryId: 'family-help', illustrationId: 'quest.dragon.breakfast', rewardDefinitionId: 'reward.dragon-mountain.bridge', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'Le bol du sommet', instruction: 'Apporte ton bol près de l’évier.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'Le camp du petit déjeuner', instruction: 'Range ton bol et essuie les petites miettes.', readingLevel: 'short-text', estimatedMinutes: 5 },
      '9-10': { title: 'Le ravitaillement du matin', instruction: 'Range ta place après le petit déjeuner et laisse la table prête.', readingLevel: 'independent', estimatedMinutes: 7 },
    },
  },
  {
    id: 'family.morning.prepare-day', worldId: DRAGON_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.dragon.prepare-day', rewardDefinitionId: 'reward.dragon-mountain.goat', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'Le départ du dragon', instruction: 'Prends ton sac et ton manteau.', readingLevel: 'visual', estimatedMinutes: 4 },
      '6-8': { title: 'Le départ vers les crêtes', instruction: 'Vérifie ton sac, ton manteau et tes chaussures.', readingLevel: 'short-text', estimatedMinutes: 6 },
      '9-10': { title: 'La vérification du grimpeur', instruction: 'Contrôle tes affaires essentielles et adapte ton équipement à la journée.', readingLevel: 'independent', estimatedMinutes: 8 },
    },
  },
];
