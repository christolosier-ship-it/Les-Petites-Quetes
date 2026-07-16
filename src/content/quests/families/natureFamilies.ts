import type { QuestFamilySeed } from '../QuestFamily';
import { NATURE_WORLD_ID } from '../../world/worldCatalog';

export const natureQuestFamilies: readonly QuestFamilySeed[] = [
  {
    id: 'family.nature.sky', worldId: NATURE_WORLD_ID, categoryId: 'discovery', illustrationId: 'quest.nature.sky', rewardDefinitionId: 'reward.nature-discovery.magnifier', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'La couleur du ciel', instruction: 'Regarde le ciel et nomme sa couleur.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'Le message des nuages', instruction: 'Observe le ciel et décris deux détails différents.', readingLevel: 'short-text', estimatedMinutes: 5 },
      '9-10': { title: 'Le relevé du ciel', instruction: 'Observe nuages, lumière et vent puis formule une petite prévision.', readingLevel: 'independent', estimatedMinutes: 8 },
    },
  },
  {
    id: 'family.nature.leaves', worldId: NATURE_WORLD_ID, categoryId: 'discovery', illustrationId: 'quest.nature.leaves', rewardDefinitionId: 'reward.nature-discovery.seed', requiresAdultHelp: true, defaultValidation: 'together',
    variants: {
      '3-5': { title: 'Trois feuilles', instruction: 'Avec un adulte, trouve trois feuilles.', readingLevel: 'visual', estimatedMinutes: 8 },
      '6-8': { title: 'Les feuilles différentes', instruction: 'Avec un adulte, compare trois formes de feuilles.', readingLevel: 'short-text', estimatedMinutes: 12 },
      '9-10': { title: 'Le petit herbier', instruction: 'Observe plusieurs feuilles et classe-les selon deux critères simples.', readingLevel: 'independent', estimatedMinutes: 15 },
    },
  },
  {
    id: 'family.nature.water-plant', worldId: NATURE_WORLD_ID, categoryId: 'family-help', illustrationId: 'quest.nature.plant', rewardDefinitionId: 'reward.nature-discovery.pond', requiresAdultHelp: true, defaultValidation: 'together',
    variants: {
      '3-5': { title: 'La plante boit', instruction: 'Avec un adulte, arrose une plante.', readingLevel: 'visual', estimatedMinutes: 4 },
      '6-8': { title: 'Le jardin de Brindille', instruction: 'Vérifie la terre puis arrose seulement si elle est sèche.', readingLevel: 'short-text', estimatedMinutes: 6 },
      '9-10': { title: 'Le soin du jardin', instruction: 'Observe la plante, décide avec un adulte du soin utile puis réalise-le.', readingLevel: 'independent', estimatedMinutes: 10 },
    },
  },
  {
    id: 'family.nature.sounds', worldId: NATURE_WORLD_ID, categoryId: 'discovery', illustrationId: 'quest.nature.sounds', rewardDefinitionId: 'reward.nature-discovery.squirrel', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'Les sons cachés', instruction: 'Écoute et montre trois sons.', readingLevel: 'visual', estimatedMinutes: 5 },
      '6-8': { title: 'La chasse aux sons', instruction: 'Écoute trois sons et devine leur origine.', readingLevel: 'short-text', estimatedMinutes: 8 },
      '9-10': { title: 'La carte sonore', instruction: 'Repère plusieurs sons naturels et situe leur direction autour de toi.', readingLevel: 'independent', estimatedMinutes: 10 },
    },
  },
  {
    id: 'family.nature.garden-sort', worldId: NATURE_WORLD_ID, categoryId: 'special-adventure', illustrationId: 'quest.nature.garden', rewardDefinitionId: 'reward.nature-discovery.nest', requiresAdultHelp: true, defaultValidation: 'together',
    variants: {
      '3-5': { title: 'Le panier nature', instruction: 'Avec un adulte, trie trois trouvailles.', readingLevel: 'visual', estimatedMinutes: 7 },
      '6-8': { title: 'Le cabinet de curiosités', instruction: 'Classe cinq trouvailles par forme, couleur ou matière.', readingLevel: 'short-text', estimatedMinutes: 12 },
      '9-10': { title: 'La collection de terrain', instruction: 'Organise quelques observations et explique la règle de classement choisie.', readingLevel: 'independent', estimatedMinutes: 15 },
    },
  },
];
