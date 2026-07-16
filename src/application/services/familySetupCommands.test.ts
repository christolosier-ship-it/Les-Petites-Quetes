import { describe, expect, it } from 'vitest';
import { createEmptyFamilyState } from '../model/FamilyState';
import { builtinQuestTemplates } from '../../content/quests/builtinQuests';
import {
  addChildProfile,
  addCustomQuestTemplate,
  addQuestSchedule,
  archiveChild,
  archiveCustomQuestTemplate,
  customizeBuiltinTemplate,
  duplicateQuestSchedule,
  editChildProfile,
  editCustomQuestTemplate,
  replaceQuestSchedule,
  restoreChild,
  restoreCustomQuestTemplate,
  setScheduleSuspended,
} from './familySetupCommands';
import { SequenceIds, TEST_NOW, TEST_TODAY } from '../../tests/familyTestFixture';

describe('commandes de préparation familiale', () => {
  it('gère le cycle complet d’un profil enfant', () => {
    const ids = new SequenceIds();
    const created = addChildProfile(createEmptyFamilyState(), {
      displayName: ' Maddie ',
      ageBand: '3-5',
      readingLevel: 'visual',
      avatarId: 'avatar.firefly',
      accentId: 'accent.sunrise',
      activeWorldId: 'world.firefly-forest',
    }, TEST_NOW, ids);
    const childId = created.children[0]!.id;
    expect(created.settings.activeChildId).toBe(childId);

    const edited = editChildProfile(created, childId, {
      displayName: 'Maddie L.',
      ageBand: '6-8',
      readingLevel: 'short-text',
      avatarId: 'avatar.fox',
      accentId: 'accent.moss',
    }, '2026-07-16T12:01:00.000Z');
    expect(edited.children[0]).toMatchObject({ displayName: 'Maddie L.', ageBand: '6-8' });

    const archived = archiveChild(edited, childId, '2026-07-16T12:02:00.000Z');
    expect(archived.children[0]?.isArchived).toBe(true);
    expect(archived.settings.activeChildId).toBeUndefined();

    const restored = restoreChild(archived, childId, '2026-07-16T12:03:00.000Z');
    expect(restored.children[0]?.isArchived).toBe(false);
    expect(restored.settings.activeChildId).toBe(childId);
  });

  it('personnalise, modifie, archive et restaure un modèle', () => {
    const ids = new SequenceIds();
    const source = builtinQuestTemplates[0]!;
    const customized = customizeBuiltinTemplate(
      createEmptyFamilyState(),
      source,
      { title: 'Mon armure du matin' },
      TEST_NOW,
      ids,
    );
    const templateId = customized.questTemplateId;
    expect(customized.state.customQuestTemplates[0]).toMatchObject({
      id: templateId,
      source: 'custom',
      title: 'Mon armure du matin',
    });

    const edited = editCustomQuestTemplate(
      customized.state,
      templateId,
      { parentNote: 'Préparer les vêtements la veille.' },
      '2026-07-16T12:01:00.000Z',
    );
    expect(edited.customQuestTemplates[0]?.parentNote).toContain('veille');

    const archived = archiveCustomQuestTemplate(edited, templateId, '2026-07-16T12:02:00.000Z');
    expect(archived.customQuestTemplates[0]?.isArchived).toBe(true);

    const restored = restoreCustomQuestTemplate(archived, templateId, '2026-07-16T12:03:00.000Z');
    expect(restored.customQuestTemplates[0]?.isArchived).toBe(false);
  });

  it('crée, remplace, suspend, reprend et duplique une routine multi-enfants', () => {
    const ids = new SequenceIds();
    let state = createEmptyFamilyState();
    for (const displayName of ['Maddie', 'Nais']) {
      state = addChildProfile(state, {
        displayName,
        ageBand: '3-5',
        readingLevel: 'visual',
        avatarId: 'avatar.firefly',
        accentId: 'accent.sunrise',
        activeWorldId: 'world.firefly-forest',
      }, TEST_NOW, ids);
    }
    const template = addCustomQuestTemplate(state, {
      title: 'La table du village',
      instruction: 'Pose les serviettes sur la table.',
      categoryId: 'family-help',
      illustrationId: 'quest.family',
      ageBands: ['3-5'],
      readingLevel: 'visual',
      estimatedMinutes: 5,
      steps: [],
      requiresAdultHelp: false,
      defaultValidation: 'parent',
      rewardDefinitionId: 'reward.bench',
    }, TEST_NOW, ids);
    state = addQuestSchedule(template.state, {
      questTemplateId: template.questTemplateId,
      childIds: state.children.map((child) => child.id),
      kind: 'weekly',
      startDate: TEST_TODAY,
      endDate: '2026-08-31',
      weekdays: ['mon', 'thu'],
      dayMoment: 'before-meal',
      exactTime: '18:00',
      priority: 'optional',
      validationMode: 'parent',
    }, TEST_NOW, TEST_TODAY, ids);
    const scheduleId = state.schedules[0]!.id;
    expect(state.occurrences.length).toBeGreaterThan(0);

    const suspended = setScheduleSuspended(state, scheduleId, true, '2026-07-16T12:01:00.000Z');
    expect(suspended.schedules[0]?.isSuspended).toBe(true);
    const resumed = setScheduleSuspended(suspended, scheduleId, false, '2026-07-16T12:02:00.000Z');
    expect(resumed.schedules[0]?.isSuspended).toBe(false);

    const duplicated = duplicateQuestSchedule(
      resumed,
      scheduleId,
      '2026-07-20',
      '2026-07-16T12:03:00.000Z',
      TEST_TODAY,
      ids,
    );
    expect(duplicated.schedules).toHaveLength(2);

    const replaced = replaceQuestSchedule(
      duplicated,
      scheduleId,
      {
        questTemplateId: template.questTemplateId,
        childIds: [state.children[0]!.id],
        kind: 'one-off',
        startDate: '2026-07-18',
        dayMoment: 'morning',
        priority: 'required',
        validationMode: 'together',
      },
      '2026-07-16T12:04:00.000Z',
      TEST_TODAY,
      ids,
    );
    expect(replaced.schedules.find((item) => item.id === scheduleId)?.isSuspended).toBe(true);
    expect(replaced.schedules.at(-1)).toMatchObject({ kind: 'one-off', validationMode: 'together' });
    expect(replaced.occurrences.filter((item) => item.scheduleId === scheduleId && item.deletedAt)).not.toHaveLength(0);
  });
});
