import type { QuestFamilySeed } from '../QuestFamily';
import { FIREFLY_WORLD_ID } from '../../world/worldCatalog';

export const fireflyQuestFamilies: readonly QuestFamilySeed[] = [
  {
    id: 'family.evening.brush-teeth', worldId: FIREFLY_WORLD_ID, categoryId: 'hygiene-routine', illustrationId: 'quest.firefly.brush-teeth', rewardDefinitionId: 'reward.firefly', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'Les dents brillantes', instruction: 'Brosse doucement toutes tes dents.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'Les crocs de lumière', instruction: 'Brosse chaque zone de tes dents pendant deux minutes.', readingLevel: 'short-text', estimatedMinutes: 3, steps: [{ id: 'top', instruction: 'Brosse les dents du haut.' }, { id: 'bottom', instruction: 'Brosse les dents du bas.' }] },
      '9-10': { title: 'Le rituel des crocs', instruction: 'Brosse soigneusement toutes les faces de tes dents puis rince ton matériel.', readingLevel: 'independent', estimatedMinutes: 4 },
    },
  },
  {
    id: 'family.evening.pyjamas', worldId: FIREFLY_WORLD_ID, categoryId: 'hygiene-routine', illustrationId: 'quest.firefly.pyjamas', rewardDefinitionId: 'reward.lantern', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'La tenue des rêves', instruction: 'Mets ton pyjama pour la nuit.', readingLevel: 'visual', estimatedMinutes: 5 },
      '6-8': { title: 'La tenue des rêves', instruction: 'Mets ton pyjama et range tes vêtements du jour.', readingLevel: 'short-text', estimatedMinutes: 6 },
      '9-10': { title: 'Le passage en mode nuit', instruction: 'Prépare ta tenue de nuit et laisse tes vêtements prêts pour le rangement.', readingLevel: 'independent', estimatedMinutes: 6 },
    },
  },
  {
    id: 'family.evening.tidy-room', worldId: FIREFLY_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.firefly.tidy-room', rewardDefinitionId: 'reward.mushroom', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'Trois jouets au nid', instruction: 'Range trois jouets dans leur maison.', readingLevel: 'visual', estimatedMinutes: 4 },
      '6-8': { title: 'La clairière rangée', instruction: 'Range les jouets visibles et libère un petit passage.', readingLevel: 'short-text', estimatedMinutes: 7 },
      '9-10': { title: 'Le campement du soir', instruction: 'Range ta zone principale et prépare un espace calme pour demain.', readingLevel: 'independent', estimatedMinutes: 10 },
    },
  },
  {
    id: 'family.evening.calm', worldId: FIREFLY_WORLD_ID, categoryId: 'wellbeing', illustrationId: 'quest.firefly.calm', rewardDefinitionId: 'reward.star', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'Le souffle de Luma', instruction: 'Respire doucement cinq fois.', readingLevel: 'visual', estimatedMinutes: 2 },
      '6-8': { title: 'Les lumières tranquilles', instruction: 'Fais cinq respirations lentes en relâchant tes épaules.', readingLevel: 'short-text', estimatedMinutes: 3 },
      '9-10': { title: 'La pause des lucioles', instruction: 'Prends trois minutes pour respirer lentement et laisser la journée se poser.', readingLevel: 'independent', estimatedMinutes: 3 },
    },
  },
  {
    id: 'family.evening.story', worldId: FIREFLY_WORLD_ID, categoryId: 'discovery', illustrationId: 'quest.firefly.story', rewardDefinitionId: 'reward.book', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'Le livre du soir', instruction: 'Choisis un livre pour ce soir.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'La page des lucioles', instruction: 'Choisis un livre et lis ou écoute quelques pages.', readingLevel: 'short-text', estimatedMinutes: 10 },
      '9-10': { title: 'Le chapitre avant la nuit', instruction: 'Prépare ton livre et lis un chapitre ou un passage choisi.', readingLevel: 'independent', estimatedMinutes: 15 },
    },
  },
];
