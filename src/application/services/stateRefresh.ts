import { findQuestVariantForAge } from '../../content/quests/builtinQuests';
import { releaseDueQuestOccurrences, generateQuestOccurrences } from '../../domain/schedule/OccurrenceGeneration';
import { addLocalDays } from '../../domain/shared/localDate';
import type { FamilyState } from '../model/FamilyState';
import type { IdGenerator } from '../ports/IdGenerator';

export function refreshScheduledOccurrences(
  state: FamilyState,
  today: string,
  now: string,
  ids: IdGenerator,
): FamilyState {
  let occurrences = [...releaseDueQuestOccurrences(state.occurrences, today, now)];
  const toDate = addLocalDays(today, 14);

  for (const schedule of state.schedules) {
    const generated = generateQuestOccurrences({
      schedule,
      children: state.children,
      existingOccurrences: occurrences,
      generationRange: { fromDate: today, toDate, today, generatedAt: now },
      createOccurrenceId: () => ids.next(),
      resolveQuestVariantId: (familyId, ageBand, fallbackTemplateId) =>
        findQuestVariantForAge(familyId, ageBand, state.customQuestTemplates, fallbackTemplateId)?.id
        ?? fallbackTemplateId,
    });
    occurrences = [...occurrences, ...generated];
  }

  return { ...state, occurrences };
}
