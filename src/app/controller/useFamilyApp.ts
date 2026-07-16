import { useCallback, useEffect, useRef, useState } from 'react';
import { createEmptyFamilyState, type FamilyState } from '../../application/model/FamilyState';
import type { FamilyBackupSummary } from '../../application/ports/FamilyRepository';
import {
  addChildProfile,
  addCustomQuestTemplate,
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
import { StateCommitQueue } from '../../application/services/StateCommitQueue';
import { builtinQuestTemplates } from '../../content/quests/builtinQuests';
import type { ChildProfileChanges, ChildProfileInput } from '../../domain/child/ChildProfile';
import type { QuestTemplateChanges, QuestTemplateInput } from '../../domain/quest/QuestTemplate';
import type { QuestScheduleInput } from '../../domain/schedule/QuestSchedule';
import { addLocalDays } from '../../domain/shared/localDate';
import { parseFamilyBackup, serializeFamilyBackup } from '../../persistence/backup/familyBackup';
import { IndexedDbFamilyRepository } from '../../persistence/repositories/IndexedDbFamilyRepository';
import { SystemClock } from '../../platform/clock/SystemClock';
import { CryptoIdGenerator } from '../../platform/ids/CryptoIdGenerator';
import type { FamilyAppController, OnboardingInput } from './FamilyAppController';

export type { FamilyAppController, OnboardingInput } from './FamilyAppController';

const repository = new IndexedDbFamilyRepository();
const clock = new SystemClock();
const ids = new CryptoIdGenerator();

function assertPin(pin: string): void {
  if (!/^\d{4}$/.test(pin)) throw new Error('Le code parent doit contenir quatre chiffres.');
}

function activePreferenceChanges(changes: Partial<FamilyState['settings']>) {
  const allowed: Partial<FamilyState['settings']> = {};
  if (changes.soundEnabled !== undefined) allowed.soundEnabled = changes.soundEnabled;
  if (changes.narrationEnabled !== undefined) allowed.narrationEnabled = changes.narrationEnabled;
  if (changes.reducedMotion !== undefined) allowed.reducedMotion = changes.reducedMotion;
  if (changes.defaultValidationMode !== undefined) {
    allowed.defaultValidationMode = changes.defaultValidationMode;
  }
  if (changes.celebrationDurationSeconds !== undefined) {
    allowed.celebrationDurationSeconds = changes.celebrationDurationSeconds;
  }
  return allowed;
}

export function useFamilyApp(): FamilyAppController {
  const [state, setState] = useState<FamilyState>(createEmptyFamilyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [backups, setBackups] = useState<readonly FamilyBackupSummary[]>([]);
  const queueRef = useRef<StateCommitQueue<FamilyState>>();

  if (queueRef.current === undefined) {
    queueRef.current = new StateCommitQueue(
      state,
      async (_current, next) => repository.save(next),
      setState,
    );
  }
  const queue = queueRef.current;

  const refreshBackups = useCallback(async () => {
    setBackups(await repository.listBackups());
  }, []);

  useEffect(() => {
    let active = true;
    void repository
      .load()
      .then(async (loaded) => {
        const refreshed = refreshScheduledOccurrences(
          loaded,
          clock.todayLocal(),
          clock.nowIso(),
          ids,
        );
        await repository.save(refreshed);
        if (!active) return;
        queue.hydrate(refreshed);
        await refreshBackups();
        setReady(true);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Chargement impossible.');
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, [queue, refreshBackups]);

  const apply = useCallback(
    async (transform: (current: FamilyState) => FamilyState) => {
      setError(undefined);
      try {
        await queue.enqueue(transform);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Action impossible.');
        throw reason;
      }
    },
    [queue],
  );

  const completeOnboarding = useCallback(
    async (input: OnboardingInput) => {
      assertPin(input.pin);
      if (input.suggestedTemplateIds.length < 1 || input.suggestedTemplateIds.length > 3) {
        throw new Error('Choisis entre une et trois premières quêtes.');
      }
      await apply((current) => {
        if (current.settings.onboardingCompleted) throw new Error('Le premier lancement est déjà terminé.');
        let next = addChildProfile(current, input.child, clock.nowIso(), ids);
        const childId = next.settings.activeChildId!;
        next = {
          ...next,
          settings: {
            ...next.settings,
            parentPin: input.pin,
            defaultValidationMode: input.defaultValidationMode,
            onboardingCompleted: true,
          },
        };
        for (const templateId of input.suggestedTemplateIds) {
          const template = builtinQuestTemplates.find((candidate) => candidate.id === templateId);
          if (!template) throw new Error('Une quête suggérée est introuvable.');
          next = addQuestSchedule(
            next,
            {
              questTemplateId: template.id,
              childIds: [childId],
              kind: 'immediate',
              startDate: clock.todayLocal(),
              dayMoment: 'anytime',
              priority: 'required',
              validationMode: input.defaultValidationMode,
            },
            clock.nowIso(),
            clock.todayLocal(),
            ids,
          );
        }
        return next;
      });
      setParentUnlocked(true);
    },
    [apply],
  );

  const flow = useCallback(
    async (command: (current: FamilyState, now: string) => FamilyState) => {
      await apply((current) => command(current, clock.nowIso()));
    },
    [apply],
  );

  const createCustomQuest = useCallback(
    async (template: QuestTemplateInput, schedule: Omit<QuestScheduleInput, 'questTemplateId'>) => {
      await apply((current) => {
        const created = addCustomQuestTemplate(current, template, clock.nowIso(), ids);
        return addQuestSchedule(
          created.state,
          { ...schedule, questTemplateId: created.questTemplateId },
          clock.nowIso(),
          clock.todayLocal(),
          ids,
        );
      });
    },
    [apply],
  );

  return {
    state,
    ready,
    ...(error !== undefined ? { error } : {}),
    parentUnlocked,
    backups,
    builtinTemplates: builtinQuestTemplates,
    completeOnboarding,
    createChild: async (input: ChildProfileInput) =>
      apply((current) => addChildProfile(current, input, clock.nowIso(), ids)),
    updateChild: async (childId: string, changes: ChildProfileChanges) =>
      apply((current) => editChildProfile(current, childId, changes, clock.nowIso())),
    archiveChild: async (childId) =>
      apply((current) => archiveChild(current, childId, clock.nowIso())),
    restoreChild: async (childId) =>
      apply((current) => restoreChild(current, childId, clock.nowIso())),
    selectChild: async (childId) =>
      apply((current) => ({ ...current, settings: { ...current.settings, activeChildId: childId } })),
    setParentPin: async (pin) => {
      assertPin(pin);
      await apply((current) => ({ ...current, settings: { ...current.settings, parentPin: pin } }));
      setParentUnlocked(true);
    },
    unlockParent: (pin) => {
      const valid = queue.current().settings.parentPin === pin;
      setParentUnlocked(valid);
      return valid;
    },
    lockParent: () => setParentUnlocked(false),
    createSchedule: async (input) =>
      apply((current) => addQuestSchedule(current, input, clock.nowIso(), clock.todayLocal(), ids)),
    replaceSchedule: async (scheduleId, input) =>
      apply((current) => replaceQuestSchedule(
        current,
        scheduleId,
        input,
        clock.nowIso(),
        clock.todayLocal(),
        ids,
      )),
    setScheduleSuspended: async (scheduleId, suspended) =>
      apply((current) => setScheduleSuspended(current, scheduleId, suspended, clock.nowIso())),
    duplicateSchedule: async (scheduleId, startDate) =>
      apply((current) => duplicateQuestSchedule(
        current,
        scheduleId,
        startDate,
        clock.nowIso(),
        clock.todayLocal(),
        ids,
      )),
    createCustomQuest,
    customizeBuiltinQuest: async (templateId, changes, schedule) =>
      apply((current) => {
        const source = builtinQuestTemplates.find((template) => template.id === templateId);
        if (!source) throw new Error('Modèle intégré introuvable.');
        const customized = customizeBuiltinTemplate(current, source, changes, clock.nowIso(), ids);
        return addQuestSchedule(
          customized.state,
          { ...schedule, questTemplateId: customized.questTemplateId },
          clock.nowIso(),
          clock.todayLocal(),
          ids,
        );
      }),
    updateCustomQuest: async (templateId: string, changes: QuestTemplateChanges) =>
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
      current,
      id,
      addLocalDays(clock.todayLocal(), 1),
      clock.todayLocal(),
      now,
    )),
    ignoreQuest: async (id) => flow((current, now) => ignoreOccurrence(current, id, now)),
    acknowledgeReward: async (rewardGrantId) => apply((current) => {
      if (!current.rewardGrants.some((grant) => grant.id === rewardGrantId)) {
        throw new Error('Récompense introuvable.');
      }
      return current.acknowledgedRewardGrantIds.includes(rewardGrantId)
        ? current
        : {
            ...current,
            acknowledgedRewardGrantIds: [...current.acknowledgedRewardGrantIds, rewardGrantId],
          };
    }),
    updatePreferences: async (changes) => apply((current) => ({
      ...current,
      settings: { ...current.settings, ...activePreferenceChanges(changes) },
    })),
    exportBackup: () => serializeFamilyBackup(queue.current(), clock.nowIso()),
    importBackup: async (content) => {
      const imported = parseFamilyBackup(content).state;
      const now = clock.nowIso();
      await queue.enqueue(
        () => ({ ...imported, settings: { ...imported.settings, lastBackupAt: now } }),
        (current, next) => repository.replaceWithBackup(current, next, 'before-import', now),
      );
      await refreshBackups();
    },
    refreshBackups,
    restoreBackup: async (key) => {
      await queue.resolve(async () => {
        const restored = await repository.restoreBackup(key, clock.nowIso());
        const refreshed = refreshScheduledOccurrences(
          restored,
          clock.todayLocal(),
          clock.nowIso(),
          ids,
        );
        await repository.save(refreshed);
        return refreshed;
      });
      await refreshBackups();
    },
    resetAll: async () => {
      await queue.resolve(async () => {
        await repository.clear();
        return createEmptyFamilyState();
      });
      setParentUnlocked(false);
      setBackups([]);
    },
  };
}
