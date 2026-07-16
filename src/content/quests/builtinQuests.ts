import { createBuiltinQuestTemplate, type QuestTemplate, type QuestTemplateInput } from '../../domain/quest/QuestTemplate';
import type { AgeBand } from '../../domain/shared/types';
import { FIREFLY_WORLD_ID } from '../world/worldCatalog';
import rawLegacyQuests from './builtin-quests.json';
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

type LegacyInput = Omit<QuestTemplateInput, 'familyId' | 'worldId'> & { readonly id: string };
const LEGACY_CREATED_AT = '2026-01-01T00:00:00.000Z';

export const legacyQuestTemplates: readonly QuestTemplate[] = (rawLegacyQuests as readonly LegacyInput[]).map(({ id, ...input }) =>
  createBuiltinQuestTemplate(
    { ...input, familyId: id, worldId: FIREFLY_WORLD_ID, steps: input.steps ?? [] },
    { id, contentVersion: '2.0.0-legacy', createdAt: LEGACY_CREATED_AT },
  ),
);

export function findQuestTemplate(id: string, customTemplates: readonly QuestTemplate[]): QuestTemplate | undefined {
  return customTemplates.find((template) => template.id === id)
    ?? builtinQuestTemplates.find((template) => template.id === id)
    ?? legacyQuestTemplates.find((template) => template.id === id);
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
