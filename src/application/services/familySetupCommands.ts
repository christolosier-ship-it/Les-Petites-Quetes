import {
  archiveChildProfile,
  createChildProfile,
  restoreChildProfile,
  updateChildProfile,
  type ChildProfileChanges,
  type ChildProfileInput,
} from '../../domain/child/ChildProfile';
import { incrementRevision } from '../../domain/shared/entity';
import {
  archiveQuestTemplate,
  createCustomQuestTemplate,
  customizeQuestTemplate,
  restoreQuestTemplate,
  updateCustomQuestTemplate,
  type QuestTemplate,
  type QuestTemplateChanges,
  type QuestTemplateInput,
} from '../../domain/quest/QuestTemplate';
import {
  createQuestSchedule,
  resumeQuestSchedule,
  suspendQuestSchedule,
  type QuestSchedule,
  type QuestScheduleInput,
} from '../../domain/schedule/QuestSchedule';
import type { FamilyState } from '../model/FamilyState';
import type { IdGenerator } from '../ports/IdGenerator';
import { refreshScheduledOccurrences } from './stateRefresh';

function childById(state: FamilyState, childId: string) {
  const child = state.children.find((candidate) => candidate.id === childId);
  if (!child) throw new Error('Profil enfant introuvable.');
  return child;
}

function customTemplateById(state: FamilyState, templateId: string): QuestTemplate {
  const template = state.customQuestTemplates.find((candidate) => candidate.id === templateId);
  if (!template) throw new Error('Modèle personnalisé introuvable.');
  return template;
}

function scheduleById(state: FamilyState, scheduleId: string): QuestSchedule {
  const schedule = state.schedules.find((candidate) => candidate.id === scheduleId);
  if (!schedule) throw new Error('Planification introuvable.');
  return schedule;
}

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

export function editChildProfile(
  state: FamilyState,
  childId: string,
  changes: ChildProfileChanges,
  now: string,
): FamilyState {
  childById(state, childId);
  return {
    ...state,
    children: state.children.map((child) =>
      child.id === childId ? updateChildProfile(child, changes, now) : child,
    ),
  };
}

export function archiveChild(state: FamilyState, childId: string, now: string): FamilyState {
  childById(state, childId);
  const children = state.children.map((child) =>
    child.id === childId ? archiveChildProfile(child, now) : child,
  );
  const activeChildId = state.settings.activeChildId === childId
    ? children.find((child) => !child.isArchived && child.deletedAt === undefined)?.id
    : state.settings.activeChildId;
  const { activeChildId: previousActiveChildId, ...settingsWithoutActive } = state.settings;
  void previousActiveChildId;
  return {
    ...state,
    children,
    settings: activeChildId !== undefined
      ? { ...state.settings, activeChildId }
      : settingsWithoutActive,
  };
}

export function restoreChild(state: FamilyState, childId: string, now: string): FamilyState {
  const restored = restoreChildProfile(childById(state, childId), now);
  return {
    ...state,
    children: state.children.map((child) => child.id === childId ? restored : child),
    settings: state.settings.activeChildId === undefined
      ? { ...state.settings, activeChildId: childId }
      : state.settings,
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

export function customizeBuiltinTemplate(
  state: FamilyState,
  template: QuestTemplate,
  changes: QuestTemplateChanges,
  now: string,
  ids: IdGenerator,
): { readonly state: FamilyState; readonly questTemplateId: string } {
  const customized = customizeQuestTemplate(template, changes, { id: ids.next(), createdAt: now });
  return {
    state: { ...state, customQuestTemplates: [...state.customQuestTemplates, customized] },
    questTemplateId: customized.id,
  };
}

export function editCustomQuestTemplate(
  state: FamilyState,
  templateId: string,
  changes: QuestTemplateChanges,
  now: string,
): FamilyState {
  const updated = updateCustomQuestTemplate(customTemplateById(state, templateId), changes, now);
  return {
    ...state,
    customQuestTemplates: state.customQuestTemplates.map((template) =>
      template.id === templateId ? updated : template,
    ),
  };
}

export function archiveCustomQuestTemplate(
  state: FamilyState,
  templateId: string,
  now: string,
): FamilyState {
  const archived = archiveQuestTemplate(customTemplateById(state, templateId), now);
  return {
    ...state,
    customQuestTemplates: state.customQuestTemplates.map((template) =>
      template.id === templateId ? archived : template,
    ),
  };
}

export function restoreCustomQuestTemplate(
  state: FamilyState,
  templateId: string,
  now: string,
): FamilyState {
  const restored = restoreQuestTemplate(customTemplateById(state, templateId), now);
  return {
    ...state,
    customQuestTemplates: state.customQuestTemplates.map((template) =>
      template.id === templateId ? restored : template,
    ),
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

export function replaceQuestSchedule(
  state: FamilyState,
  scheduleId: string,
  input: QuestScheduleInput,
  now: string,
  today: string,
  ids: IdGenerator,
): FamilyState {
  const previous = scheduleById(state, scheduleId);
  const replacement = createQuestSchedule(input, { id: ids.next(), createdAt: now });
  const schedules = state.schedules.map((schedule) =>
    schedule.id === scheduleId ? suspendQuestSchedule(previous, now) : schedule,
  );
  const occurrences = state.occurrences.map((occurrence) => {
    if (occurrence.scheduleId !== scheduleId || ['completed', 'ignored'].includes(occurrence.status)) {
      return occurrence;
    }
    return { ...occurrence, ...incrementRevision(occurrence, now), deletedAt: now };
  });
  return refreshScheduledOccurrences(
    { ...state, schedules: [...schedules, replacement], occurrences },
    today,
    now,
    ids,
  );
}

export function setScheduleSuspended(
  state: FamilyState,
  scheduleId: string,
  suspended: boolean,
  now: string,
): FamilyState {
  const selected = scheduleById(state, scheduleId);
  const updated = suspended
    ? suspendQuestSchedule(selected, now)
    : resumeQuestSchedule(selected, now);
  return {
    ...state,
    schedules: state.schedules.map((schedule) => schedule.id === scheduleId ? updated : schedule),
  };
}

export function duplicateQuestSchedule(
  state: FamilyState,
  scheduleId: string,
  startDate: string,
  now: string,
  today: string,
  ids: IdGenerator,
): FamilyState {
  const source = scheduleById(state, scheduleId);
  return addQuestSchedule(
    state,
    {
      questTemplateId: source.questTemplateId,
      childIds: source.childIds,
      kind: source.kind,
      startDate,
      ...(source.endDate !== undefined ? { endDate: source.endDate } : {}),
      ...(source.weekdays !== undefined ? { weekdays: source.weekdays } : {}),
      dayMoment: source.dayMoment,
      ...(source.exactTime !== undefined ? { exactTime: source.exactTime } : {}),
      priority: source.priority,
      validationMode: source.validationMode,
    },
    now,
    today,
    ids,
  );
}
