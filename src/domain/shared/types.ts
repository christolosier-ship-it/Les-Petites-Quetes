export const AGE_BANDS = ['3-5', '6-8', '9-10'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export const READING_LEVELS = ['visual', 'short-text', 'independent'] as const;
export type ReadingLevel = (typeof READING_LEVELS)[number];

export const VALIDATION_MODES = ['child', 'parent', 'together'] as const;
export type ValidationMode = (typeof VALIDATION_MODES)[number];

export const QUEST_CATEGORIES = [
  'autonomy',
  'hygiene-routine',
  'family-help',
  'creativity',
  'discovery',
  'wellbeing',
  'kindness',
  'special-adventure',
] as const;
export type QuestCategoryId = (typeof QUEST_CATEGORIES)[number];

export type ValidationFeedback = 'small-step-remains' | 'review-together';

export function belongsTo<T extends string>(value: string, values: readonly T[]): value is T {
  return values.some((candidate) => candidate === value);
}
