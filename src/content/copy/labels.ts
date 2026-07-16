import type { QuestCategoryId } from '../../domain/shared/types';
import type { DayMoment, ValidationMode } from '../../domain/shared/types';

export const categoryLabels: Readonly<Record<QuestCategoryId, string>> = {
  autonomy: 'Autonomie',
  'hygiene-routine': 'Hygiène et routines',
  'family-help': 'Participation familiale',
  creativity: 'Créativité',
  discovery: 'Découverte',
  wellbeing: 'Bien-être',
  kindness: 'Gentillesse',
  'special-adventure': 'Aventure spéciale',
};

export const dayMomentLabels: Readonly<Record<DayMoment, string>> = {
  morning: 'Matin',
  'after-school': 'Retour à la maison',
  'before-meal': 'Avant le repas',
  'after-meal': 'Après le repas',
  evening: 'Soirée',
  bedtime: 'Coucher',
  anytime: 'À tout moment',
};

export const validationLabels: Readonly<Record<ValidationMode, string>> = {
  child: 'Validation immédiate',
  parent: 'Validation parent',
  together: 'À regarder ensemble',
};
