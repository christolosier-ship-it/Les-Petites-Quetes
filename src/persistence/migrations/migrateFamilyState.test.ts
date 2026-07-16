import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION, createEmptyFamilyState } from '../../application/model/FamilyState';
import { migrateFamilyState } from './migrateFamilyState';

function v1State() {
  const current = createEmptyFamilyState();
  const { acknowledgedRewardGrantIds, ...withoutAcknowledgements } = current;
  const {
    onboardingCompleted,
    celebrationDurationSeconds,
    ...legacySettings
  } = current.settings;
  void acknowledgedRewardGrantIds;
  void onboardingCompleted;
  void celebrationDurationSeconds;
  return {
    ...withoutAcknowledgements,
    settings: { ...legacySettings, schemaVersion: 1 },
  };
}

describe('migration de l’état familial', () => {
  it('initialise un premier lancement vide', () => {
    expect(migrateFamilyState(undefined)).toEqual(createEmptyFamilyState());
  });

  it('migre réellement un état V1 vers V2', () => {
    const migrated = migrateFamilyState(v1State());
    expect(migrated.settings.schemaVersion).toBe(SCHEMA_VERSION);
    expect(migrated.settings.celebrationDurationSeconds).toBe(5);
    expect(migrated.settings.onboardingCompleted).toBe(false);
    expect(migrated.acknowledgedRewardGrantIds).toEqual([]);
  });

  it('refuse une version inconnue sans modifier les données', () => {
    expect(() => migrateFamilyState({
      ...createEmptyFamilyState(),
      settings: { ...createEmptyFamilyState().settings, schemaVersion: 99 },
    })).toThrow(/Version de schéma/);
  });

  it('refuse une entité importée structurellement invalide', () => {
    expect(() => migrateFamilyState({
      ...createEmptyFamilyState(),
      children: [{ id: 'child-incomplet' }],
    })).toThrow();
  });

  it('refuse une progression falsifiée', () => {
    expect(() => migrateFamilyState({
      ...createEmptyFamilyState(),
      worldProgress: [{
        id: 'progress-1', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', revision: 1,
        childId: 'child-inconnu', worldId: 'world.firefly-forest', worldVersion: '1.0.0', stage: 3,
        completionCount: 99, unlockedRewardIds: [], unlockedStoryChapterIds: [],
      }],
    })).toThrow();
  });
});
