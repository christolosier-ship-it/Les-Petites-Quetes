import type { FamilyState } from '../../application/model/FamilyState';
import { builtinQuestTemplates, legacyQuestTemplates } from '../../content/quests/builtinQuests';
import { allRewards } from '../../content/world/worldCatalog';
import type { EntityMetadata } from '../../domain/shared/entity';

function assertGlobalIds(groups: readonly (readonly EntityMetadata[])[]): void {
  const allIds = groups.flatMap((group) => group.map((entity) => entity.id));
  if (new Set(allIds).size !== allIds.length) throw new Error('Deux entités familiales partagent le même identifiant.');
}

function templateMap(state: FamilyState) {
  return new Map([
    ...builtinQuestTemplates,
    ...legacyQuestTemplates,
    ...state.customQuestTemplates,
  ].map((template) => [template.id, template]));
}

function assertScheduleReferences(state: FamilyState): void {
  const childIds = new Set(state.children.map((child) => child.id));
  const templates = templateMap(state);
  for (const schedule of state.schedules) {
    const template = templates.get(schedule.questTemplateId);
    if (!template) throw new Error('Une planification référence une quête inconnue.');
    if (template.worldId !== schedule.worldId) throw new Error('Une planification et sa quête utilisent deux univers différents.');
    if (schedule.childIds.some((id) => !childIds.has(id))) throw new Error('Une planification référence un enfant inconnu.');
  }
}

function assertOccurrenceReferences(state: FamilyState): void {
  const childIds = new Set(state.children.map((child) => child.id));
  const schedules = new Map(state.schedules.map((schedule) => [schedule.id, schedule]));
  const completionIds = new Set(state.completions.map((completion) => completion.id));
  const templates = templateMap(state);
  const occurrenceKeys = new Set<string>();
  for (const occurrence of state.occurrences) {
    const schedule = schedules.get(occurrence.scheduleId);
    if (!schedule) throw new Error('Une occurrence référence une planification inconnue.');
    const template = templates.get(occurrence.questTemplateId);
    if (!template) throw new Error('Une occurrence référence une quête inconnue.');
    if (occurrence.worldId !== schedule.worldId || occurrence.worldId !== template.worldId) throw new Error('Une occurrence contient un univers incohérent.');
    if (occurrence.questFamilyId !== schedule.questFamilyId || occurrence.questFamilyId !== template.familyId) throw new Error('Une occurrence contient une famille de quête incohérente.');
    if (!childIds.has(occurrence.childId)) throw new Error('Une occurrence référence un enfant inconnu.');
    const key = `${occurrence.scheduleId}:${occurrence.childId}:${occurrence.localDate}`;
    if (occurrenceKeys.has(key)) throw new Error('Deux occurrences partagent la même clé métier.');
    occurrenceKeys.add(key);
    if (occurrence.status === 'completed' && occurrence.completionId === undefined) throw new Error('Une occurrence terminée doit référencer sa réalisation.');
    if (occurrence.completionId !== undefined && !completionIds.has(occurrence.completionId)) throw new Error('Une occurrence référence une réalisation inconnue.');
  }
}

function assertCompletionReferences(state: FamilyState): void {
  const childIds = new Set(state.children.map((child) => child.id));
  const occurrenceIds = new Set(state.occurrences.map((occurrence) => occurrence.id));
  const grantIds = new Set(state.rewardGrants.map((grant) => grant.id));
  const completedOccurrences = new Set<string>();
  for (const completion of state.completions) {
    if (!occurrenceIds.has(completion.occurrenceId) || !childIds.has(completion.childId)) throw new Error('Une réalisation contient une référence inconnue.');
    if (!grantIds.has(completion.rewardGrantId)) throw new Error('Une réalisation référence une récompense absente.');
    if (completedOccurrences.has(completion.occurrenceId)) throw new Error('Une occurrence possède plusieurs réalisations.');
    completedOccurrences.add(completion.occurrenceId);
  }
}

function assertRewardReferences(state: FamilyState): void {
  const childIds = new Set(state.children.map((child) => child.id));
  const completionIds = new Set(state.completions.map((completion) => completion.id));
  const rewardIds = new Set(allRewards.map((reward) => reward.id));
  const rewardedCompletions = new Set<string>();
  for (const grant of state.rewardGrants) {
    if (!completionIds.has(grant.completionId) || !childIds.has(grant.childId)) throw new Error('Une récompense attribuée contient une référence inconnue.');
    if (!rewardIds.has(grant.rewardDefinitionId)) throw new Error('Une récompense attribuée utilise une définition inconnue.');
    if (rewardedCompletions.has(grant.completionId)) throw new Error('Une réalisation possède plusieurs récompenses principales.');
    rewardedCompletions.add(grant.completionId);
  }
  const grantIds = new Set(state.rewardGrants.map((grant) => grant.id));
  if (state.acknowledgedRewardGrantIds.some((id) => !grantIds.has(id))) throw new Error('Une célébration reconnue référence une récompense inconnue.');
}

export function assertFamilyReferences(state: FamilyState): void {
  assertGlobalIds([state.children, state.customQuestTemplates, state.schedules, state.occurrences, state.completions, state.rewardGrants, state.worldProgress]);
  assertScheduleReferences(state);
  assertOccurrenceReferences(state);
  assertCompletionReferences(state);
  assertRewardReferences(state);
}
