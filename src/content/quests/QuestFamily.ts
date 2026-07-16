import { createBuiltinQuestTemplate, type QuestStep, type QuestTemplate } from '../../domain/quest/QuestTemplate';
import type { AgeBand, QuestCategoryId, ReadingLevel, ValidationMode } from '../../domain/shared/types';
import type { WorldId } from '../../domain/world/WorldDefinition';

export interface QuestAgeVariantSeed {
  readonly title: string;
  readonly instruction: string;
  readonly readingLevel: ReadingLevel;
  readonly estimatedMinutes: number;
  readonly steps?: readonly QuestStep[];
}

export interface QuestFamilySeed {
  readonly id: string;
  readonly worldId: WorldId;
  readonly categoryId: QuestCategoryId;
  readonly illustrationId: string;
  readonly rewardDefinitionId: string;
  readonly requiresAdultHelp: boolean;
  readonly defaultValidation: ValidationMode;
  readonly parentNote?: string;
  readonly variants: Readonly<Record<AgeBand, QuestAgeVariantSeed>>;
}

const CONTENT_CREATED_AT = '2026-01-01T00:00:00.000Z';
export const MULTI_UNIVERSE_CONTENT_VERSION = '3.0.0';

export function buildQuestTemplates(families: readonly QuestFamilySeed[]): readonly QuestTemplate[] {
  return families.flatMap((family) =>
    (Object.entries(family.variants) as readonly [AgeBand, QuestAgeVariantSeed][]).map(([ageBand, variant]) =>
      createBuiltinQuestTemplate(
        {
          familyId: family.id,
          worldId: family.worldId,
          title: variant.title,
          instruction: variant.instruction,
          categoryId: family.categoryId,
          illustrationId: family.illustrationId,
          ageBands: [ageBand],
          readingLevel: variant.readingLevel,
          estimatedMinutes: variant.estimatedMinutes,
          steps: variant.steps ?? [],
          requiresAdultHelp: family.requiresAdultHelp,
          defaultValidation: family.defaultValidation,
          rewardDefinitionId: family.rewardDefinitionId,
          ...(family.parentNote !== undefined ? { parentNote: family.parentNote } : {}),
        },
        { id: `${family.id}.${ageBand}`, contentVersion: MULTI_UNIVERSE_CONTENT_VERSION, createdAt: CONTENT_CREATED_AT },
      ),
    ),
  );
}
