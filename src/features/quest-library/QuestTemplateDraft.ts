import { defaultRewardForWorld } from '../../content/world/worldCatalog';
import type { QuestTemplate, QuestTemplateInput } from '../../domain/quest/QuestTemplate';
import type { AgeBand, QuestCategoryId, ReadingLevel, ValidationMode } from '../../domain/shared/types';
import type { WorldId } from '../../domain/world/WorldDefinition';

export interface QuestTemplateDraft {
  readonly worldId: WorldId;
  readonly title: string;
  readonly instruction: string;
  readonly categoryId: QuestCategoryId;
  readonly ageBands: readonly AgeBand[];
  readonly readingLevel: ReadingLevel;
  readonly estimatedMinutes: string;
  readonly stepsText: string;
  readonly requiresAdultHelp: boolean;
  readonly defaultValidation: ValidationMode;
  readonly rewardDefinitionId: string;
  readonly parentNote: string;
}

export function draftFromTemplate(template?: QuestTemplate): QuestTemplateDraft {
  const worldId = template?.worldId ?? 'world.firefly-forest';
  return {
    worldId,
    title: template?.title ?? '',
    instruction: template?.instruction ?? '',
    categoryId: template?.categoryId ?? 'autonomy',
    ageBands: template?.ageBands ?? ['3-5'],
    readingLevel: template?.readingLevel ?? 'visual',
    estimatedMinutes: String(template?.estimatedMinutes ?? 10),
    stepsText: template?.steps.map((step) => step.instruction).join('\n') ?? '',
    requiresAdultHelp: template?.requiresAdultHelp ?? false,
    defaultValidation: template?.defaultValidation ?? 'parent',
    rewardDefinitionId: template?.rewardDefinitionId ?? defaultRewardForWorld(worldId),
    parentNote: template?.parentNote ?? '',
  };
}

export function inputFromDraft(draft: QuestTemplateDraft): Omit<QuestTemplateInput, 'familyId'> {
  const steps = draft.stepsText
    .split('\n')
    .map((instruction) => instruction.trim())
    .filter(Boolean)
    .map((instruction, index) => ({ id: `step-${index + 1}`, instruction }));

  return {
    worldId: draft.worldId,
    title: draft.title,
    instruction: draft.instruction,
    categoryId: draft.categoryId,
    illustrationId: `quest.${draft.worldId.slice(6)}.${draft.categoryId}`,
    ageBands: draft.ageBands,
    readingLevel: draft.readingLevel,
    estimatedMinutes: Number(draft.estimatedMinutes),
    steps,
    requiresAdultHelp: draft.requiresAdultHelp,
    defaultValidation: draft.defaultValidation,
    rewardDefinitionId: draft.rewardDefinitionId,
    ...(draft.parentNote.trim() !== '' ? { parentNote: draft.parentNote } : {}),
  };
}
