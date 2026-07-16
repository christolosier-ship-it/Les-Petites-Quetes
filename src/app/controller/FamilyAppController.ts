import type { FamilyState } from '../../application/model/FamilyState';
import type { FamilyBackupSummary } from '../../application/ports/FamilyRepository';
import type { ChildProfileChanges, ChildProfileInput } from '../../domain/child/ChildProfile';
import type { QuestTemplate, QuestTemplateChanges, QuestTemplateInput } from '../../domain/quest/QuestTemplate';
import type { QuestScheduleInput } from '../../domain/schedule/QuestSchedule';
import type { ValidationMode } from '../../domain/shared/types';

export interface OnboardingInput {
  readonly pin: string;
  readonly child: ChildProfileInput;
  readonly defaultValidationMode: ValidationMode;
  readonly suggestedTemplateIds: readonly string[];
}

type ScheduleWithoutQuest = Omit<QuestScheduleInput, 'questTemplateId' | 'questFamilyId' | 'worldId'>;

export interface FamilyAppController {
  readonly state: FamilyState;
  readonly ready: boolean;
  readonly error?: string;
  readonly parentUnlocked: boolean;
  readonly backups: readonly FamilyBackupSummary[];
  readonly builtinTemplates: readonly QuestTemplate[];
  readonly completeOnboarding: (input: OnboardingInput) => Promise<void>;
  readonly createChild: (input: ChildProfileInput) => Promise<void>;
  readonly updateChild: (childId: string, changes: ChildProfileChanges) => Promise<void>;
  readonly archiveChild: (childId: string) => Promise<void>;
  readonly restoreChild: (childId: string) => Promise<void>;
  readonly selectChild: (childId: string) => Promise<void>;
  readonly setParentPin: (pin: string) => Promise<void>;
  readonly unlockParent: (pin: string) => boolean;
  readonly lockParent: () => void;
  readonly createSchedule: (input: QuestScheduleInput) => Promise<void>;
  readonly replaceSchedule: (scheduleId: string, input: QuestScheduleInput) => Promise<void>;
  readonly setScheduleSuspended: (scheduleId: string, suspended: boolean) => Promise<void>;
  readonly duplicateSchedule: (scheduleId: string, startDate: string) => Promise<void>;
  readonly createCustomQuest: (template: Omit<QuestTemplateInput, 'familyId'>, schedule: ScheduleWithoutQuest) => Promise<void>;
  readonly customizeBuiltinQuest: (templateId: string, changes: QuestTemplateChanges, schedule: ScheduleWithoutQuest) => Promise<void>;
  readonly updateCustomQuest: (templateId: string, changes: QuestTemplateChanges) => Promise<void>;
  readonly archiveCustomQuest: (templateId: string) => Promise<void>;
  readonly restoreCustomQuest: (templateId: string) => Promise<void>;
  readonly startQuest: (occurrenceId: string) => Promise<void>;
  readonly finishQuest: (occurrenceId: string) => Promise<void>;
  readonly approveQuest: (occurrenceId: string) => Promise<void>;
  readonly requestAnotherStep: (occurrenceId: string) => Promise<void>;
  readonly requestJointReview: (occurrenceId: string) => Promise<void>;
  readonly postponeQuest: (occurrenceId: string) => Promise<void>;
  readonly ignoreQuest: (occurrenceId: string) => Promise<void>;
  readonly acknowledgeReward: (rewardGrantId: string) => Promise<void>;
  readonly updatePreferences: (changes: Partial<FamilyState['settings']>) => Promise<void>;
  readonly exportBackup: () => string;
  readonly importBackup: (content: string) => Promise<void>;
  readonly refreshBackups: () => Promise<void>;
  readonly restoreBackup: (key: string) => Promise<void>;
  readonly resetAll: () => Promise<void>;
}
