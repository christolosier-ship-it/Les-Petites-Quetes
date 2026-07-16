import { useCallback, useEffect, useRef, useState } from 'react';
import { createEmptyFamilyState, type FamilyState } from '../../application/model/FamilyState';
import type { FamilyBackupSummary } from '../../application/ports/FamilyRepository';
import {
  addChildProfile,
  addCustomQuestTemplate,
  addQuestSchedule,
} from '../../application/services/familySetupCommands';
import { refreshScheduledOccurrences } from '../../application/services/stateRefresh';
import { StateCommitQueue } from '../../application/services/StateCommitQueue';
import { builtinQuestTemplates } from '../../content/quests/builtinQuests';
import type { QuestTemplateInput } from '../../domain/quest/QuestTemplate';
import type { QuestScheduleInput } from '../../domain/schedule/QuestSchedule';
import { parseFamilyBackup } from '../../persistence/backup/familyBackup';
import { IndexedDbFamilyRepository } from '../../persistence/repositories/IndexedDbFamilyRepository';
import { SystemClock } from '../../platform/clock/SystemClock';
import { CryptoIdGenerator } from '../../platform/ids/CryptoIdGenerator';
import type { FamilyAppController, OnboardingInput } from './FamilyAppController';
import { createFamilyController } from './createFamilyController';

export type { FamilyAppController, OnboardingInput } from './FamilyAppController';

const repository = new IndexedDbFamilyRepository();
const clock = new SystemClock();
const ids = new CryptoIdGenerator();

function assertPin(pin: string): void {
  if (!/^\d{4}$/.test(pin)) throw new Error('Le code parent doit contenir quatre chiffres.');
}

export function useFamilyApp(): FamilyAppController {
  const [state, setState] = useState<FamilyState>(createEmptyFamilyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [backups, setBackups] = useState<readonly FamilyBackupSummary[]>([]);
  const queueRef = useRef<StateCommitQueue<FamilyState> | undefined>(undefined);

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
        if (current.settings.onboardingCompleted) {
          throw new Error('Le premier lancement est déjà terminé.');
        }
        let next = addChildProfile(current, input.child, clock.nowIso(), ids);
        const childId = next.settings.activeChildId;
        if (!childId) throw new Error('Le premier profil n’a pas pu être sélectionné.');
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

  const controller = createFamilyController({
    state,
    ready,
    ...(error !== undefined ? { error } : {}),
    parentUnlocked,
    backups,
    queue,
    repository,
    clock,
    ids,
    apply,
    flow,
    completeOnboarding,
    createCustomQuest,
    refreshBackups,
    setParentUnlocked,
    setBackups,
  });

  return {
    ...controller,
    importBackup: async (content) => {
      const imported = parseFamilyBackup(content).state;
      const now = clock.nowIso();
      await queue.enqueue(
        () => ({ ...imported, settings: { ...imported.settings, lastBackupAt: now } }),
        (current, next) => repository.replaceWithBackup(current, next, 'before-import', now),
      );
      await refreshBackups();
    },
  };
}
