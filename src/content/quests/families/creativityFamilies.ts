import type { QuestFamilySeed } from '../QuestFamily';
import { CREATIVITY_WORLD_ID } from '../../world/worldCatalog';

export const creativityQuestFamilies: readonly QuestFamilySeed[] = [
  {
    id: 'family.creativity.draw', worldId: CREATIVITY_WORLD_ID, categoryId: 'creativity', illustrationId: 'quest.creativity.draw', rewardDefinitionId: 'reward.creativity-workshop.paint', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'Le dessin surprise', instruction: 'Dessine une chose que tu aimes.', readingLevel: 'visual', estimatedMinutes: 10 },
      '6-8': { title: 'La fenêtre imaginaire', instruction: 'Dessine un lieu inventé avec trois détails.', readingLevel: 'short-text', estimatedMinutes: 15 },
      '9-10': { title: 'Le carnet de concept', instruction: 'Imagine un lieu, dessine-le et ajoute quelques notes utiles.', readingLevel: 'independent', estimatedMinutes: 20 },
    },
  },
  {
    id: 'family.creativity.build', worldId: CREATIVITY_WORLD_ID, categoryId: 'creativity', illustrationId: 'quest.creativity.build', rewardDefinitionId: 'reward.creativity-workshop.toolbox', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'La tour de Mimo', instruction: 'Construis une tour avec tes jouets.', readingLevel: 'visual', estimatedMinutes: 10 },
      '6-8': { title: 'Le refuge miniature', instruction: 'Construis un refuge qui tient debout tout seul.', readingLevel: 'short-text', estimatedMinutes: 18 },
      '9-10': { title: 'Le prototype secret', instruction: 'Construis un objet simple, teste-le puis améliore un détail.', readingLevel: 'independent', estimatedMinutes: 25 },
    },
  },
  {
    id: 'family.creativity.story', worldId: CREATIVITY_WORLD_ID, categoryId: 'creativity', illustrationId: 'quest.creativity.story', rewardDefinitionId: 'reward.creativity-workshop.paper-bird', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'L’histoire de trois objets', instruction: 'Choisis trois objets et raconte leur aventure.', readingLevel: 'visual', estimatedMinutes: 8 },
      '6-8': { title: 'Le récit de Mimo', instruction: 'Invente un début, un problème et une fin.', readingLevel: 'short-text', estimatedMinutes: 15 },
      '9-10': { title: 'Le scénario de l’atelier', instruction: 'Écris ou raconte une scène avec un personnage, un but et un obstacle.', readingLevel: 'independent', estimatedMinutes: 20 },
    },
  },
  {
    id: 'family.creativity.music', worldId: CREATIVITY_WORLD_ID, categoryId: 'creativity', illustrationId: 'quest.creativity.music', rewardDefinitionId: 'reward.creativity-workshop.melody', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'Le rythme des mains', instruction: 'Tape un petit rythme avec tes mains.', readingLevel: 'visual', estimatedMinutes: 5 },
      '6-8': { title: 'Le concert des objets', instruction: 'Crée un rythme avec trois sons différents.', readingLevel: 'short-text', estimatedMinutes: 10 },
      '9-10': { title: 'La boucle musicale', instruction: 'Compose une courte suite de sons et répète-la régulièrement.', readingLevel: 'independent', estimatedMinutes: 15 },
    },
  },
  {
    id: 'family.creativity.paper', worldId: CREATIVITY_WORLD_ID, categoryId: 'creativity', illustrationId: 'quest.creativity.paper', rewardDefinitionId: 'reward.creativity-workshop.stage', requiresAdultHelp: true, defaultValidation: 'together',
    variants: {
      '3-5': { title: 'Le papier magique', instruction: 'Avec un adulte, plie et décore une feuille.', readingLevel: 'visual', estimatedMinutes: 10 },
      '6-8': { title: 'Le trésor de papier', instruction: 'Fabrique un petit objet en papier avec un adulte.', readingLevel: 'short-text', estimatedMinutes: 18 },
      '9-10': { title: 'La création en papier', instruction: 'Choisis un modèle simple, prépare les étapes puis réalise-le avec soin.', readingLevel: 'independent', estimatedMinutes: 25 },
    },
  },
];
