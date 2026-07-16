import {
  archiveChildProfile,
  createChildProfile,
  type ChildProfileInput,
} from '../../domain/child/ChildProfile';
import {
  createCustomQuestTemplate,
  type QuestTemplateInput,
} from '../../domain/quest/QuestTemplate';
import {
  createQuestSchedule,
  type QuestScheduleInput,
} from '../../domain/schedule/QuestSchedule';
import type { FamilyState } from '../model/FamilyState';
import type { IdGenerator } from '../ports/IdGenerator';
import { refreshScheduledOccurrences } from './stateRefresh';

export function addChildProfile(
  state: FamilyState,
  input: ChildProfileInput,
  now: string,
  ids: IdGenerator,
): FamilyState {
  const child = createChildProfile(input, { id: ids.next(), createdAt: now });
  return {
    ...state,
    children: [...state.children, child],
    settings: {
      ...state.settings,
      ...(state.settings.activeChildId === undefined ? { activeChildId: child.id } : {}),
    },
  };
}

export function archiveChild(
  state: FamilyState,
  childId: string,
  now: string,
): FamilyState {
  const children = state.children.map((child) =>
    child.id === childId ? archiveChildProfile(child, now) : child,
  );
  const activeChildId =
    state.settings.activeChildId === childId
      ? children.find((child) => !child.isArchived && child.deletedAt === undefined)?.id
      : state.settings.activeChildId;
  return {
    ...state,
    children,
    settings: {
      ...state.settings,
      ...(activeChildId !== undefined ? { activeChildId } : {}),
    },
  };
}

export function addCustomQuestTemplate(
  state: FamilyState,
  input: QuestTemplateInput,
  now: string,
  ids: IdGenerator,
): { readonly state: FamilyState; readonly questTemplateId: string } {
  const template = createCustomQuestTemplate(input, { id: ids.next(), createdAt: now });
  return {
    state: { ...state, customQuestTemplates: [...state.customQuestTemplates, template] },
    questTemplateId: template.id,
  };
}

export function addQuestSchedule(
  state: FamilyState,
  input: QuestScheduleInput,
  now: string,
  today: string,
  ids: IdGenerator,
): FamilyState {
  const schedule = createQuestSchedule(input, { id: ids.next(), createdAt: now });
  return refreshScheduledOccurrences(
    { ...state, schedules: [...state.schedules, schedule] },
    today,
    now,
    ids,
  );
}
