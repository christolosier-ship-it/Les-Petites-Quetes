import type { EntityMetadata } from '../shared/entity';
import type { DayMoment, ValidationMode, Weekday } from '../shared/types';
import type { WorldId } from '../world/WorldDefinition';

export const SCHEDULE_KINDS = ['immediate', 'one-off', 'weekly'] as const;
export type ScheduleKind = (typeof SCHEDULE_KINDS)[number];

export const QUEST_PRIORITIES = ['required', 'optional'] as const;
export type QuestPriority = (typeof QUEST_PRIORITIES)[number];

export interface QuestSchedule extends EntityMetadata {
  readonly questTemplateId: string;
  readonly questFamilyId: string;
  readonly worldId: WorldId;
  readonly childIds: readonly string[];
  readonly kind: ScheduleKind;
  readonly startDate: string;
  readonly endDate?: string;
  readonly weekdays?: readonly Weekday[];
  readonly dayMoment: DayMoment;
  readonly exactTime?: string;
  readonly priority: QuestPriority;
  readonly validationMode: ValidationMode;
  readonly isSuspended: boolean;
}

export interface QuestScheduleInput {
  readonly questTemplateId: string;
  readonly questFamilyId: string;
  readonly worldId: WorldId;
  readonly childIds: readonly string[];
  readonly kind: ScheduleKind;
  readonly startDate: string;
  readonly endDate?: string;
  readonly weekdays?: readonly Weekday[];
  readonly dayMoment: DayMoment;
  readonly exactTime?: string;
  readonly priority: QuestPriority;
  readonly validationMode: ValidationMode;
}

export interface QuestScheduleChanges {
  readonly questTemplateId?: string;
  readonly questFamilyId?: string;
  readonly worldId?: WorldId;
  readonly childIds?: readonly string[];
  readonly kind?: ScheduleKind;
  readonly startDate?: string;
  readonly endDate?: string | null;
  readonly weekdays?: readonly Weekday[] | null;
  readonly dayMoment?: DayMoment;
  readonly exactTime?: string | null;
  readonly priority?: QuestPriority;
  readonly validationMode?: ValidationMode;
}
