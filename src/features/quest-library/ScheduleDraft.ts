import type { QuestScheduleInput } from '../../domain/schedule/QuestSchedule';
import type { DayMoment, ValidationMode, Weekday } from '../../domain/shared/types';
import { SystemClock } from '../../platform/clock/SystemClock';

const clock = new SystemClock();

export interface ScheduleDraft {
  readonly childIds: readonly string[];
  readonly kind: 'immediate' | 'one-off' | 'weekly';
  readonly startDate: string;
  readonly endDate: string;
  readonly weekdays: readonly Weekday[];
  readonly dayMoment: DayMoment;
  readonly exactTime: string;
  readonly priority: 'required' | 'optional';
  readonly validationMode: ValidationMode;
}

export function createScheduleDraft(childId: string, validationMode: ValidationMode): ScheduleDraft {
  return {
    childIds: childId ? [childId] : [],
    kind: 'immediate',
    startDate: clock.todayLocal(),
    endDate: '',
    weekdays: ['mon'],
    dayMoment: 'anytime',
    exactTime: '',
    priority: 'required',
    validationMode,
  };
}

export function scheduleInputFromDraft(
  draft: ScheduleDraft,
): Omit<QuestScheduleInput, 'questTemplateId' | 'questFamilyId' | 'worldId'> {
  return {
    childIds: draft.childIds,
    kind: draft.kind,
    startDate: draft.kind === 'immediate' ? clock.todayLocal() : draft.startDate,
    ...(draft.kind === 'weekly' && draft.endDate !== '' ? { endDate: draft.endDate } : {}),
    ...(draft.kind === 'weekly' ? { weekdays: draft.weekdays } : {}),
    dayMoment: draft.dayMoment,
    ...(draft.exactTime !== '' ? { exactTime: draft.exactTime } : {}),
    priority: draft.priority,
    validationMode: draft.validationMode,
  };
}
