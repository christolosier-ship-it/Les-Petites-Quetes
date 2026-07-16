import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION, createEmptyFamilyState } from '../../application/model/FamilyState';
import { migrateFamilyState } from './migrateFamilyState';

function v1State() {
  const current = createEmptyFamilyState();
  const { acknowledgedRewardGrantIds, questTemplateIdsNeedingWorldReview, ...withoutV2AndV3 } = current;
  const { onboardingCompleted, celebrationDurationSeconds, ...legacySettings } = current.settings;
  void acknowledgedRewardGrantIds;
  void questTemplateIdsNeedingWorldReview;
  void onboardingCompleted;
  void celebrationDurationSeconds;
  return { ...withoutV2AndV3, settings: { ...legacySettings, schemaVersion: 1 } };
}

function v2State() {
  const current = createEmptyFamilyState();
  const { questTemplateIdsNeedingWorldReview, ...withoutV3 } = current;
  void questTemplateIdsNeedingWorldReview;
  return {
    ...withoutV3,
    children: [{
      id: 'child-1', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', revision: 1,
      displayName: 'Maddie', ageBand: '3-5', readingLevel: 'visual', avatarId: 'avatar.firefly', accentId: 'accent.sunrise', activeWorldId: 'world.firefly-forest', isArchived: false,
    }],
    customQuestTemplates: [{
      id: 'custom-1', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', revision: 1,
      source: 'custom', title: 'Ma quête', instruction: 'Range trois jouets.', categoryId: 'autonomy', illustrationId: 'quest.autonomy', ageBands: ['3-5'], readingLevel: 'visual', estimatedMinutes: 5, steps: [], requiresAdultHelp: false, defaultValidation: 'parent', rewardDefinitionId: 'reward.lantern', isArchived: false,
    }],
    settings: { ...current.settings, schemaVersion: 2, contentVersion: '2.0.0', activeChildId: 'child-1', parentPin: '1234', onboardingCompleted: true },
  };
}

describe('migration de l’état familial', () => {
  it('initialise un premier lancement vide en V3', () => {
    expect(migrateFamilyState(undefined)).toEqual(createEmptyFamilyState());
  });

  it('migre un état V1 jusqu’au schéma V3', () => {
    const migrated = migrateFamilyState(v1State());
    expect(migrated.settings.schemaVersion).toBe(SCHEMA_VERSION);
    expect(migrated.settings.celebrationDurationSeconds).toBe(5);
    expect(migrated.settings.onboardingCompleted).toBe(false);
    expect(migrated.acknowledgedRewardGrantIds).toEqual([]);
    expect(migrated.questTemplateIdsNeedingWorldReview).toEqual([]);
  });

  it('migre V2 vers V3 sans perdre les identifiants et signale les quêtes à classer', () => {
    const migrated = migrateFamilyState(v2State());
    expect(migrated.children[0]).toMatchObject({ id: 'child-1', avatarId: 'avatar.girl.3-5' });
    expect(migrated.children[0]).not.toHaveProperty('accentId');
    expect(migrated.children[0]).not.toHaveProperty('activeWorldId');
    expect(migrated.customQuestTemplates[0]).toMatchObject({ id: 'custom-1', familyId: 'custom-1', worldId: 'world.firefly-forest' });
    expect(migrated.questTemplateIdsNeedingWorldReview).toEqual(['custom-1']);
    expect(migrated.settings).toMatchObject({ schemaVersion: 3, contentVersion: '3.0.0' });
  });

  it('refuse une version inconnue sans modifier les données', () => {
    expect(() => migrateFamilyState({ ...createEmptyFamilyState(), settings: { ...createEmptyFamilyState().settings, schemaVersion: 99 } })).toThrow(/Version de schéma/);
  });

  it('refuse une entité importée structurellement invalide', () => {
    expect(() => migrateFamilyState({ ...createEmptyFamilyState(), children: [{ id: 'child-incomplet' }] })).toThrow();
  });

  it('refuse une progression falsifiée', () => {
    expect(() => migrateFamilyState({
      ...createEmptyFamilyState(),
      worldProgress: [{
        id: 'progress-1', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', revision: 1,
        childId: 'child-inconnu', worldId: 'world.firefly-forest', worldVersion: '3.0.0', stage: 3, completionCount: 99, unlockedRewardIds: [], unlockedStoryChapterIds: [],
      }],
    })).toThrow();
  });
});
