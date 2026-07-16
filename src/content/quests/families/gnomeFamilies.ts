import type { QuestFamilySeed } from '../QuestFamily';
import { GNOME_WORLD_ID } from '../../world/worldCatalog';

export const gnomeQuestFamilies: readonly QuestFamilySeed[] = [
  {
    id: 'family.school.schoolbag', worldId: GNOME_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.gnome.schoolbag', rewardDefinitionId: 'reward.gnome-village.book', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'Le petit cartable', instruction: 'Mets ton cahier dans ton cartable.', readingLevel: 'visual', estimatedMinutes: 4 },
      '6-8': { title: 'Le cartable des lutins', instruction: 'Vérifie cahiers, trousse et message pour demain.', readingLevel: 'short-text', estimatedMinutes: 7 },
      '9-10': { title: 'L’inventaire du cartable', instruction: 'Consulte ton programme et prépare chaque affaire nécessaire pour demain.', readingLevel: 'independent', estimatedMinutes: 10 },
    },
  },
  {
    id: 'family.school.homework-space', worldId: GNOME_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.gnome.desk', rewardDefinitionId: 'reward.gnome-village.desk', requiresAdultHelp: false, defaultValidation: 'parent',
    variants: {
      '3-5': { title: 'La table du lutin', instruction: 'Pose ton crayon et ton cahier.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'Le bureau de Pico', instruction: 'Libère ton espace et prépare le matériel nécessaire.', readingLevel: 'short-text', estimatedMinutes: 5 },
      '9-10': { title: 'L’atelier de concentration', instruction: 'Range les distractions et organise ton espace avant de commencer.', readingLevel: 'independent', estimatedMinutes: 6 },
    },
  },
  {
    id: 'family.school.reading', worldId: GNOME_WORLD_ID, categoryId: 'discovery', illustrationId: 'quest.gnome.reading', rewardDefinitionId: 'reward.gnome-village.gnome', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'Les images du village', instruction: 'Regarde un livre et raconte une image.', readingLevel: 'visual', estimatedMinutes: 8 },
      '6-8': { title: 'Le message des lutins', instruction: 'Lis quelques pages puis raconte une chose retenue.', readingLevel: 'short-text', estimatedMinutes: 12 },
      '9-10': { title: 'Les archives du village', instruction: 'Lis un passage choisi et résume son idée principale avec tes mots.', readingLevel: 'independent', estimatedMinutes: 15 },
    },
  },
  {
    id: 'family.school.pencil-case', worldId: GNOME_WORLD_ID, categoryId: 'autonomy', illustrationId: 'quest.gnome.pencil-case', rewardDefinitionId: 'reward.gnome-village.pencil', requiresAdultHelp: false, defaultValidation: 'child',
    variants: {
      '3-5': { title: 'La trousse de Pico', instruction: 'Range tes crayons dans la trousse.', readingLevel: 'visual', estimatedMinutes: 3 },
      '6-8': { title: 'La trousse enchantée', instruction: 'Vérifie tes crayons, ta gomme et ton taille-crayon.', readingLevel: 'short-text', estimatedMinutes: 5 },
      '9-10': { title: 'Le contrôle du matériel', instruction: 'Complète et organise ta trousse selon les besoins de la journée.', readingLevel: 'independent', estimatedMinutes: 6 },
    },
  },
  {
    id: 'family.school.review-day', worldId: GNOME_WORLD_ID, categoryId: 'wellbeing', illustrationId: 'quest.gnome.review', rewardDefinitionId: 'reward.gnome-village.bell', requiresAdultHelp: true, defaultValidation: 'together',
    variants: {
      '3-5': { title: 'Le souvenir d’école', instruction: 'Raconte un moment de ta journée.', readingLevel: 'visual', estimatedMinutes: 4 },
      '6-8': { title: 'La cloche des souvenirs', instruction: 'Raconte une réussite et une question de ta journée.', readingLevel: 'short-text', estimatedMinutes: 6 },
      '9-10': { title: 'Le carnet du village', instruction: 'Note ou raconte ce qui est compris et ce qui mérite encore de l’aide.', readingLevel: 'independent', estimatedMinutes: 8 },
    },
  },
];
