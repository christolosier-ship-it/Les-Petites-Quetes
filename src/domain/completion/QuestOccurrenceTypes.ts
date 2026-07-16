import type { EntityMetadata } from '../shared/entity';
import type { ValidationFeedback } from '../shared/types';

export type QuestOccurrenceStatus =
  | 'upcoming'
  | 'available'
  | 'started'
  | 'validation-requested'
  | 'completed'
  | 'postponed'
  | 'ignored';

export interface QuestOccurrence extends EntityMetadata {
  readonly scheduleId: string;
  readonly questTemplateId: string;
  readonly childId: string;
  readonly localDate: string;
  readonly dayMoment:
    | 'morning'
    | 'after-school'
    | 'before-meal'
    | 'after-meal'
    | 'evening'
    | 'bedtime'
    | 'anytime';
  readonly status: QuestOccurrenceStatus;
  readonly startedAt?: string;
  readonly validationRequestedAt?: string;
  readonly completedAt?: string;
  readonly postponedTo?: string;
  readonly validationNote?: ValidationFeedback;
  readonly evidenceAssetId?: string;
  readonly completionId?: string;
}
