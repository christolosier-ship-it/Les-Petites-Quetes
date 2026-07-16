import { createBuiltinQuestTemplate, type QuestTemplate, type QuestTemplateInput } from '../../domain/quest/QuestTemplate';
import rawQuests from './builtin-quests.json';

interface RawBuiltinQuest extends QuestTemplateInput {
  readonly id: string;
}

const CONTENT_CREATED_AT = '2026-01-01T00:00:00.000Z';
const CONTENT_VERSION = '1.0.0';

export const builtinQuestTemplates: readonly QuestTemplate[] = (
  rawQuests as readonly RawBuiltinQuest[]
).map(({ id, ...input }) =>
  createBuiltinQuestTemplate(
    { ...input, steps: input.steps ?? [] },
    { id, contentVersion: CONTENT_VERSION, createdAt: CONTENT_CREATED_AT },
  ),
);

export function findQuestTemplate(
  id: string,
  customTemplates: readonly QuestTemplate[],
): QuestTemplate | undefined {
  return customTemplates.find((template) => template.id === id) ??
    builtinQuestTemplates.find((template) => template.id === id);
}
