import { createEmptyFamilyState, type FamilyState } from '../../application/model/FamilyState';
import type { Clock } from '../../application/ports/Clock';
import type { FamilyBackupSummary, FamilyRepository } from '../../application/ports/FamilyRepository';
import type { IdGenerator } from '../../application/ports/IdGenerator';
import {
  addChildProfile,
  addQuestSchedule,
  archiveChild,
  archiveCustomQuestTemplate,
  customizeBuiltinTemplate,
  duplicateQuestSchedule,
  editChildProfile,
  editCustomQuestTemplate,
  replaceQuestSchedule,
  restoreChild,
  restoreCustomQuestTemplate,
  setScheduleSuspended,
} from '../../application/services/familySetupCommands';
import {
  approveOccurrence,
  askAnotherStep,
  askJointReview,
  finishOccurrence,
  ignoreOccurrence,
  postponeOccurrence,
  startOccurrence,
} from '../../application/services/questFlowCommands';
import { refreshScheduledOccurrences } from '../../application/services/stateRefresh';
import type { StateCommitQueue } from '../../application/services/StateCommitQueue';
import { builtinQuestTemplates } from '../../content/quests/builtinQuests';
import type { QuestTemplateChanges } from '../../domain/quest/QuestTemplate';
import { addLocalDays } from '../../domain/shared/localDate';
import { serializeFamilyBackup } from '../../persistence/backup/familyBackup';
import type { FamilyAppController, OnboardingInput } from './FamilyAppController';

interface ControllerRuntime {
  readonly state: FamilyState;
  readonly ready: boolean;
  readonly error?: string;
  readonly parentUnlocked: boolean;
  readonly backups: readonly FamilyBackupSummary[];
  readonly queue: StateCommitQueue<FamilyState>;
  readonly repository: FamilyRepository;
  readonly clock: Clock;
  readonly ids: IdGenerator;
  readonly apply: (transform: (current: FamilyState) => FamilyState) => Promise<void>;
  readonly flow: (command: (current: FamilyState, now: string) => FamilyState) => Promise<void>;
  readonly completeOnboarding: (input: OnboardingInput) => Promise<void>;
  readonly createCustomQuest: FamilyAppController['createCustomQuest'];
  readonly importBackup: FamilyAppController['importBackup'];
  readonly refreshBackups: () => Promise<void>;
  readonly setParentUnlocked: (value: boolean) => void;
  readonly setBackups: (value: readonly FamilyBackupSummary[]) => void;
}

function preferenceChanges(
  changes: Partial<FamilyState['settings']>,
): Partial<FamilyState['settings']> {
  return {
    ...(changes.soundEnabled !== undefined ? { soundEnabled: changes.soundEnabled } : {}),
    ...(changes.narrationEnabled !== undefined ? { narrationEnabled: changes.narrationEnabled } : {}),
    ...(changes.reducedMotion !== undefined ? { reducedMotion: changes.reducedMotion } : {}),
    ...(changes.defaultValidationMode !== undefined
      ? { defaultValidationMode: changes.defaultValidationMode }
      : {}),
    ...(changes.celebrationDurationSeconds !== undefined
      ? { celebrationDurationSeconds: changes.celebrationDurationSeconds }
      : {}),
  };
}

function customizedQuest(
  current: FamilyState,
  templateId: string,
  changes: QuestTemplateChanges,
  schedule: Parameters<FamilyAppController['customizeBuiltinQuest']>[2],
  runtime: ControllerRuntime,
): FamilyState {
  const source = builtinQuestTemplates.find((template) => template.id === templateId);
  if (!source) throw new Error('Modèle intégré introuvable.');
  const customized = customizeBuiltinTemplate(
    current,
    source,
    changes,
    runtime.clock.nowIso(),
    runtime.ids,
  );
  return addQuestSchedule(
    customized.state,
    { ...schedule, questTemplateId: customized.questTemplateId },
    runtime.clock.nowIso(),
    runtime.clock.todayLocal(),
    runtime.ids,
  );
}

export function createFamilyController(runtime: ControllerRuntime): FamilyAppController {
  const { apply, clock, ids, flow, queue, repository } = runtime;
  return {
    state: runtime.state,
    ready: runtime.ready,
    ...(runtime.error !== undefined ? { error: runtime.error } : {}),
    parentUnlocked: runtime.parentUnlocked,
    backups: runtime.backups,
    builtinTemplates: builtinQuestTemplates,
    completeOnboarding: runtime.completeOnboarding,
    createChild: async (input) =>
      apply((current) => addChildProfile(current, input, clock.nowIso(), ids)),
    updateChild: async (childId, changes) =>
      apply((current) => editChildProfile(current, childId, changes, clock.nowIso())),
    archiveChild: async (childId) =>
      apply((current) => archiveChild(current, childId, clock.nowIso())),
    restoreChild: async (childId) =>
      apply((current) => restoreChild(current, childId, clock.nowIso())),
    selectChild: async (childId) =>
      apply((current) => ({ ...current, settings: { ...current.settings, activeChildId: childId } })),
    setParentPin: async (pin) => {
      if (!/^\d{4}$/.test(pin)) throw new Error('Le code parent doit contenir quatre chiffres.');
      await apply((current) => ({ ...current, settings: { ...current.settings, parentPin: pin } }));
      runtime.setParentUnlocked(true);
    },
    unlockParent: (pin) => {
      const valid = queue.current().settings.parentPin === pin;
      runtime.setParentUnlocked(valid);
      return valid;
    },
    lockParent: () => runtime.setParentUnlocked(false),
    createSchedule: async (input) =>
      apply((current) => addQuestSchedule(current, input, clock.nowIso(), clock.todayLocal(), ids)),
    replaceSchedule: async (scheduleId, input) =>
      apply((current) => replaceQuestSchedule(
        current, scheduleId, input, clock.nowIso(), clock.todayLocal(), ids,
      )),
    setScheduleSuspended: async (scheduleId, suspended) =>
      apply((current) => setScheduleSuspended(current, scheduleId, suspended, clock.nowIso())),
    duplicateSchedule: async (scheduleId, startDate) =>
      apply((current) => duplicateQuestSchedule(
        current, scheduleId, startDate, clock.nowIso(), clock.todayLocal(), ids,
      )),
    createCustomQuest: runtime.createCustomQuest,
    customizeBuiltinQuest: async (templateId, changes, schedule) =>
      apply((current) => customizedQuest(current, templateId, changes, schedule, runtime)),
    updateCustomQuest: async (templateId, changes) =>
      apply((current) => editCustomQuestTemplate(current, templateId, changes, clock.nowIso())),
    archiveCustomQuest: async (templateId) =>
      apply((current) => archiveCustomQuestTemplate(current, templateId, clock.nowIso())),
    restoreCustomQuest: async (templateId) =>
      apply((current) => restoreCustomQuestTemplate(current, templateId, clock.nowIso())),
    startQuest: async (id) => flow((current, now) => startOccurrence(current, id, now)),
    finishQuest: async (id) => flow((current, now) => finishOccurrence(current, id, now, ids)),
    approveQuest: async (id) => flow((current, now) => approveOccurrence(current, id, now, ids)),
    requestAnotherStep: async (id) => flow((current, now) => askAnotherStep(current, id, now)),
    requestJointReview: async (id) => flow((current, now) => askJointReview(current, id, now)),
    postponeQuest: async (id) => flow((current, now) => postponeOccurrence(
      current, id, addLocalDays(clock.todayLocal(), 1), clock.todayLocal(), now,
    )),
    ignoreQuest: async (id) => flow((current, now) => ignoreOccurrence(current, id, now)),
    acknowledgeReward: async (rewardGrantId) => apply((current) => {
      if (!current.rewardGrants.some((grant) => grant.id === rewardGrantId)) {
        throw new Error('Récompense introuvable.');
      }
      return current.acknowledgedRewardGrantIds.includes(rewardGrantId)
        ? current
        : { ...current, acknowledgedRewardGrantIds: [...current.acknowledgedRewardGrantIds, rewardGrantId] };
    }),
    updatePreferences: async (changes) => apply((current) => ({
      ...current,
      settings: { ...current.settings, ...preferenceChanges(changes) },
    })),
    exportBackup: () => serializeFamilyBackup(queue.current(), clock.nowIso()),
    importBackup: runtime.importBackup,
    refreshBackups: runtime.refreshBackups,
    restoreBackup: async (key) => {
      await queue.resolve(async () => {
        const restored = await repository.restoreBackup(key, clock.nowIso());
        const refreshed = refreshScheduledOccurrences(
          restored, clock.todayLocal(), clock.nowIso(), ids,
        );
        await repository.save(refreshed);
        return refreshed;
      });
      await runtime.refreshBackups();
    },
    resetAll: async () => {
      await queue.resolve(async () => {
        await repository.clear();
        return createEmptyFamilyState();
      });
      runtime.setParentUnlocked(false);
      runtime.setBackups([]);
    },
  };
}
