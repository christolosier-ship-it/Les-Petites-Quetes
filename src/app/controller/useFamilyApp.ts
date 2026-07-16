import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChildProfileInput } from '../../domain/child/ChildProfile';
import type { QuestTemplateInput } from '../../domain/quest/QuestTemplate';
import type { QuestScheduleInput } from '../../domain/schedule/QuestSchedule';
import { addLocalDays } from '../../domain/shared/localDate';
import { builtinQuestTemplates } from '../../content/quests/builtinQuests';
import { createEmptyFamilyState, type FamilyState } from '../../application/model/FamilyState';
import {
  addChildProfile,
  addCustomQuestTemplate,
  addQuestSchedule,
  archiveChild,
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
import { parseFamilyBackup, serializeFamilyBackup } from '../../persistence/backup/familyBackup';
import { IndexedDbFamilyRepository } from '../../persistence/repositories/IndexedDbFamilyRepository';
import { SystemClock } from '../../platform/clock/SystemClock';
import { CryptoIdGenerator } from '../../platform/ids/CryptoIdGenerator';

const repository = new IndexedDbFamilyRepository();
const clock = new SystemClock();
const ids = new CryptoIdGenerator();

export interface FamilyAppController {
  readonly state: FamilyState;
  readonly ready: boolean;
  readonly error?: string;
  readonly parentUnlocked: boolean;
  readonly builtinTemplates: typeof builtinQuestTemplates;
  readonly createChild: (input: ChildProfileInput) => Promise<void>;
  readonly archiveChild: (childId: string) => Promise<void>;
  readonly selectChild: (childId: string) => Promise<void>;
  readonly setParentPin: (pin: string) => Promise<void>;
  readonly unlockParent: (pin: string) => boolean;
  readonly lockParent: () => void;
  readonly createSchedule: (input: QuestScheduleInput) => Promise<void>;
  readonly createCustomQuest: (
    template: QuestTemplateInput,
    schedule: Omit<QuestScheduleInput, 'questTemplateId'>,
  ) => Promise<void>;
  readonly startQuest: (occurrenceId: string) => Promise<void>;
  readonly finishQuest: (occurrenceId: string) => Promise<void>;
  readonly approveQuest: (occurrenceId: string) => Promise<void>;
  readonly requestAnotherStep: (occurrenceId: string) => Promise<void>;
  readonly requestJointReview: (occurrenceId: string) => Promise<void>;
  readonly postponeQuest: (occurrenceId: string) => Promise<void>;
  readonly ignoreQuest: (occurrenceId: string) => Promise<void>;
  readonly updatePreferences: (changes: Partial<FamilyState['settings']>) => Promise<void>;
  readonly exportBackup: () => string;
  readonly importBackup: (content: string) => Promise<void>;
  readonly resetAll: () => Promise<void>;
}

export function useFamilyApp(): FamilyAppController {
  const [state, setState] = useState<FamilyState>(createEmptyFamilyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const stateRef = useRef(state);

  const commit = useCallback(async (next: FamilyState) => {
    stateRef.current = next;
    setState(next);
    await repository.save(next);
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
        if (!active) return;
        await commit(refreshed);
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
  }, [commit]);

  const apply = useCallback(
    async (transform: (current: FamilyState) => FamilyState) => {
      setError(undefined);
      try {
        await commit(transform(stateRef.current));
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Action impossible.');
        throw reason;
      }
    },
    [commit],
  );

  const createChild = useCallback(
    async (input: ChildProfileInput) => {
      await apply((current) => addChildProfile(current, input, clock.nowIso(), ids));
    },
    [apply],
  );

  const createSchedule = useCallback(
    async (input: QuestScheduleInput) => {
      await apply((current) =>
        addQuestSchedule(current, input, clock.nowIso(), clock.todayLocal(), ids),
      );
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

  const flow = useCallback(
    async (command: (current: FamilyState, now: string) => FamilyState) => {
      await apply((current) => command(current, clock.nowIso()));
    },
    [apply],
  );

  return {
    state,
    ready,
    ...(error !== undefined ? { error } : {}),
    parentUnlocked,
    builtinTemplates: builtinQuestTemplates,
    createChild,
    archiveChild: async (childId) => apply((current) => archiveChild(current, childId, clock.nowIso())),
    selectChild: async (childId) =>
      apply((current) => ({
        ...current,
        settings: { ...current.settings, activeChildId: childId },
      })),
    setParentPin: async (pin) => {
      if (!/^\d{4}$/.test(pin)) throw new Error('Le code parent doit contenir quatre chiffres.');
      await apply((current) => ({
        ...current,
        settings: { ...current.settings, parentPin: pin },
      }));
      setParentUnlocked(true);
    },
    unlockParent: (pin) => {
      const valid = stateRef.current.settings.parentPin === pin;
      setParentUnlocked(valid);
      return valid;
    },
    lockParent: () => setParentUnlocked(false),
    createSchedule,
    createCustomQuest,
    startQuest: async (id) => flow((current, now) => startOccurrence(current, id, now)),
    finishQuest: async (id) => flow((current, now) => finishOccurrence(current, id, now, ids)),
    approveQuest: async (id) => flow((current, now) => approveOccurrence(current, id, now, ids)),
    requestAnotherStep: async (id) => flow((current, now) => askAnotherStep(current, id, now)),
    requestJointReview: async (id) => flow((current, now) => askJointReview(current, id, now)),
    postponeQuest: async (id) =>
      flow((current, now) =>
        postponeOccurrence(
          current,
          id,
          addLocalDays(clock.todayLocal(), 1),
          clock.todayLocal(),
          now,
        ),
      ),
    ignoreQuest: async (id) => flow((current, now) => ignoreOccurrence(current, id, now)),
    updatePreferences: async (changes) =>
      apply((current) => ({
        ...current,
        settings: { ...current.settings, ...changes },
      })),
    exportBackup: () => serializeFamilyBackup(stateRef.current, clock.nowIso()),
    importBackup: async (content) => {
      const imported = parseFamilyBackup(content).state;
      await repository.createBackup(stateRef.current, 'before-import', clock.nowIso());
      await commit(imported);
    },
    resetAll: async () => {
      await repository.clear();
      await commit(createEmptyFamilyState());
      setParentUnlocked(false);
    },
  };
}
