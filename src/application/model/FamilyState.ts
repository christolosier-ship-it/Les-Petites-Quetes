import type { ChildProfile } from '../../domain/child/ChildProfile';
import type { QuestOccurrence } from '../../domain/completion/QuestOccurrenceTypes';
import type {
  Completion,
  RewardGrant,
  WorldProgress,
} from '../../domain/progression/ProgressionTypes';
import type { QuestTemplate } from '../../domain/quest/QuestTemplate';
import type { QuestSchedule } from '../../domain/schedule/QuestSchedule';
import type { ValidationMode } from '../../domain/shared/types';

export const SCHEMA_VERSION = 2;
export const CONTENT_VERSION = '1.0.0';

export type CelebrationDurationSeconds = 3 | 5 | 8;

export interface AppSettings {
  readonly schemaVersion: typeof SCHEMA_VERSION;
  readonly contentVersion: string;
  readonly activeChildId?: string;
  readonly parentPin: string;
  readonly onboardingCompleted: boolean;
  readonly soundEnabled: boolean;
  readonly narrationEnabled: boolean;
  readonly reducedMotion: 'system' | 'reduce' | 'allow';
  readonly defaultValidationMode: ValidationMode;
  readonly celebrationDurationSeconds: CelebrationDurationSeconds;
  readonly lastBackupAt?: string;
}

export interface FamilyState {
  readonly children: readonly ChildProfile[];
  readonly customQuestTemplates: readonly QuestTemplate[];
  readonly schedules: readonly QuestSchedule[];
  readonly occurrences: readonly QuestOccurrence[];
  readonly completions: readonly Completion[];
  readonly rewardGrants: readonly RewardGrant[];
  readonly worldProgress: readonly WorldProgress[];
  readonly acknowledgedRewardGrantIds: readonly string[];
  readonly settings: AppSettings;
}

export function createEmptyFamilyState(): FamilyState {
  return {
    children: [],
    customQuestTemplates: [],
    schedules: [],
    occurrences: [],
    completions: [],
    rewardGrants: [],
    worldProgress: [],
    acknowledgedRewardGrantIds: [],
    settings: {
      schemaVersion: SCHEMA_VERSION,
      contentVersion: CONTENT_VERSION,
      parentPin: '',
      onboardingCompleted: false,
      soundEnabled: true,
      narrationEnabled: true,
      reducedMotion: 'system',
      defaultValidationMode: 'parent',
      celebrationDurationSeconds: 5,
    },
  };
}
