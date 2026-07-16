import { describe, expect, it } from 'vitest';
import { finishOccurrence } from '../../application/services/questFlowCommands';
import { createFamilyWithQuest, TEST_NOW } from '../../tests/familyTestFixture';
import { validateFamilyState } from './validateFamilyState';

describe('validation profonde de l’état familial', () => {
  function completedState() {
    const fixture = createFamilyWithQuest('child');
    const occurrenceId = fixture.state.occurrences[0]!.id;
    return finishOccurrence(fixture.state, occurrenceId, TEST_NOW, fixture.ids);
  }

  it('reconstruit un état complet et cohérent', () => {
    const state = completedState();
    expect(validateFamilyState(JSON.parse(JSON.stringify(state)))).toEqual(state);
  });

  it('refuse une référence de planification inconnue', () => {
    const state = completedState();
    expect(() => validateFamilyState({
      ...state,
      occurrences: [{ ...state.occurrences[0], scheduleId: 'schedule-absent' }],
    })).toThrow(/planification inconnue/);
  });

  it('refuse les doubles réalisations et récompenses', () => {
    const state = completedState();
    const completion = state.completions[0]!;
    expect(() => validateFamilyState({
      ...state,
      completions: [completion, { ...completion, id: 'completion-dupliquee' }],
    })).toThrow(/plusieurs réalisations|identifiant/);

    const grant = state.rewardGrants[0]!;
    expect(() => validateFamilyState({
      ...state,
      rewardGrants: [grant, { ...grant, id: 'grant-duplique' }],
    })).toThrow(/plusieurs récompenses/);
  });

  it('refuse une progression modifiée indépendamment de l’historique', () => {
    const state = completedState();
    expect(() => validateFamilyState({
      ...state,
      worldProgress: [{ ...state.worldProgress[0], completionCount: 99, stage: 3 }],
    })).toThrow(/progression enregistrée/);
    expect(() => validateFamilyState({
      ...state,
      worldProgress: [{ ...state.worldProgress[0], unlockedRewardIds: [] }],
    })).toThrow(/récompenses débloquées/);
    expect(() => validateFamilyState({
      ...state,
      worldProgress: [{ ...state.worldProgress[0], unlockedStoryChapterIds: [] }],
    })).toThrow(/chapitres débloqués/);
  });

  it('refuse un profil actif archivé et un onboarding incomplet', () => {
    const fixture = createFamilyWithQuest();
    expect(() => validateFamilyState({
      ...fixture.state,
      children: [{ ...fixture.state.children[0], isArchived: true }],
    })).toThrow(/profil actif/);
    expect(() => validateFamilyState({
      ...fixture.state,
      settings: {
        ...fixture.state.settings,
        onboardingCompleted: true,
        parentPin: '',
      },
    })).toThrow(/onboarding terminé/);
  });

  it('refuse une célébration et un univers inconnus', () => {
    const state = completedState();
    expect(() => validateFamilyState({
      ...state,
      acknowledgedRewardGrantIds: ['grant-absent'],
    })).toThrow(/célébration reconnue/);
    expect(() => validateFamilyState({
      ...state,
      worldProgress: [{ ...state.worldProgress[0], worldId: 'world.unknown' }],
    })).toThrow(/univers inconnu/);
  });
});
