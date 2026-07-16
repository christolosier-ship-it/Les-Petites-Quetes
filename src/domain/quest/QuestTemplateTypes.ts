import type { EntityMetadata } from '../shared/entity';
import type {
  AgeBand,
  QuestCategoryId,
  ReadingLevel,
  ValidationMode,
} from '../shared/types';
import type { WorldId } from '../world/WorldDefinition';

export interface QuestStep {
  readonly id: string;
  readonly instruction: string;
}

export type QuestTemplateSource = 'builtin' | 'custom';

export interface QuestTemplate extends EntityMetadata {
  readonly source: QuestTemplateSource;
  readonly contentVersion?: string;
  readonly familyId: string;
  readonly worldId: WorldId;
  readonly title: string;
  readonly instruction: string;
  readonly categoryId: QuestCategoryId;
  readonly illustrationId: string;
  readonly ageBands: readonly AgeBand[];
  readonly readingLevel: ReadingLevel;
  readonly estimatedMinutes?: number;
  readonly steps: readonly QuestStep[];
  readonly requiresAdultHelp: boolean;
  readonly defaultValidation: ValidationMode;
  readonly rewardDefinitionId: string;
  readonly parentNote?: string;
  readonly isArchived: boolean;
}

export interface QuestTemplateInput {
  readonly familyId: string;
  readonly worldId: WorldId;
  readonly title: string;
  readonly instruction: string;
  readonly categoryId: QuestCategoryId;
  readonly illustrationId: string;
  readonly ageBands: readonly AgeBand[];
  readonly readingLevel: ReadingLevel;
  readonly estimatedMinutes?: number;
  readonly steps?: readonly QuestStep[];
  readonly requiresAdultHelp: boolean;
  readonly defaultValidation: ValidationMode;
  readonly rewardDefinitionId: string;
  readonly parentNote?: string;
}

export interface QuestTemplateChanges {
  readonly familyId?: string;
  readonly worldId?: WorldId;
  readonly title?: string;
  readonly instruction?: string;
  readonly categoryId?: QuestCategoryId;
  readonly illustrationId?: string;
  readonly ageBands?: readonly AgeBand[];
  readonly readingLevel?: ReadingLevel;
  readonly estimatedMinutes?: number | null;
  readonly steps?: readonly QuestStep[];
  readonly requiresAdultHelp?: boolean;
  readonly defaultValidation?: ValidationMode;
  readonly rewardDefinitionId?: string;
  readonly parentNote?: string | null;
}
