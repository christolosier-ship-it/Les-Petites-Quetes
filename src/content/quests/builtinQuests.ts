import type { QuestTemplate } from '../../domain/quest/QuestTemplate';
import type { AgeBand } from '../../domain/shared/types';
import { buildQuestTemplates, type QuestFamilySeed } from './QuestFamily';
import { creativityQuestFamilies } from './families/creativityFamilies';
import { dragonQuestFamilies } from './families/dragonFamilies';
import { fireflyQuestFamilies } from './families/fireflyFamilies';
import { gnomeQuestFamilies } from './families/gnomeFamilies';
import { natureQuestFamilies } from './families/natureFamilies';
import { spaceQuestFamilies } from './families/spaceFamilies';

export const builtinQuestFamilies: readonly QuestFamilySeed[] = [
  ...fireflyQuestFamilies,
  ...dragonQuestFamilies,
  ...spaceQuestFamilies,
  ...gnomeQuestFamilies,
  ...natureQuestFamilies,
  ...creativityQuestFamilies,
];

export const builtinQuestTemplates: readonly QuestTemplate[] = buildQuestTemplates(builtinQuestFamilies);

export function findQuestTemplate(id: string, customTemplates: readonly QuestTemplate[]): QuestTemplate | undefined {
  return customTemplates.find((template) => template.id === id) ?? builtinQuestTemplates.find((template) => template.id === id);
}

export function findQuestVariantForAge(
  familyId: string,
  ageBand: AgeBand,
  customTemplates: readonly QuestTemplate[],
  fallbackTemplateId?: string,
): QuestTemplate | undefined {
  return customTemplates.find((template) => template.familyId === familyId && template.ageBands.includes(ageBand))
    ?? builtinQuestTemplates.find((template) => template.familyId === familyId && template.ageBands.length === 1 && template.ageBands[0] === ageBand)
    ?? (fallbackTemplateId === undefined ? undefined : findQuestTemplate(fallbackTemplateId, customTemplates));
}

export function questFamiliesForWorld(worldId: string): readonly QuestFamilySeed[] {
  return builtinQuestFamilies.filter((family) => family.worldId === worldId);
}
