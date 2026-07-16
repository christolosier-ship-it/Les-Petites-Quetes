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

describe('commandes de préparation familiale V3', () => {
  it('gère le cycle complet d’un profil et contrôle son avatar', () => {
    const ids = new SequenceIds();
    const created = addChildProfile(createEmptyFamilyState(), {
      displayName: ' Maddie ', ageBand: '3-5', readingLevel: 'visual', avatarId: 'avatar.girl.3-5',
    }, TEST_NOW, ids);
    const childId = created.children[0]!.id;
    expect(created.settings.activeChildId).toBe(childId);
    const edited = editChildProfile(created, childId, {
      displayName: 'Maddie L.', ageBand: '6-8', readingLevel: 'short-text', avatarId: 'avatar.girl.6-8',
    }, '2026-07-16T12:01:00.000Z');
    expect(edited.children[0]).toMatchObject({ displayName: 'Maddie L.', ageBand: '6-8', avatarId: 'avatar.girl.6-8' });
    expect(() => editChildProfile(edited, childId, { avatarId: 'avatar.boy.3-5' }, 'bad')).toThrow(/avatar/i);
    const archived = archiveChild(edited, childId, '2026-07-16T12:02:00.000Z');
    expect(archived.settings.activeChildId).toBeUndefined();
    const restored = restoreChild(archived, childId, '2026-07-16T12:03:00.000Z');
    expect(restored.settings.activeChildId).toBe(childId);
  });

  it('personnalise un modèle tout en conservant son univers', () => {
    const ids = new SequenceIds();
    const source = builtinQuestTemplates.find((template) => template.id === 'family.morning.dress.3-5')!;
    const customized = customizeBuiltinTemplate(createEmptyFamilyState(), source, { title: 'Mon armure du matin' }, TEST_NOW, ids);
    const templateId = customized.questTemplateId;
    expect(customized.state.customQuestTemplates[0]).toMatchObject({ id: templateId, source: 'custom', worldId: 'world.dragon-mountain', familyId: templateId });
    const edited = editCustomQuestTemplate(customized.state, templateId, { parentNote: 'Préparer les vêtements la veille.' }, 'later');
    expect(edited.customQuestTemplates[0]?.parentNote).toContain('veille');
    const archived = archiveCustomQuestTemplate(edited, templateId, 'archive');
    const restored = restoreCustomQuestTemplate(archived, templateId, 'restore');
    expect(restored.customQuestTemplates[0]?.isArchived).toBe(false);
  });

  it('crée une quête familiale et une routine multi-enfants avec variantes par âge', () => {
    const ids = new SequenceIds();
    let state = createEmptyFamilyState();
    state = addChildProfile(state, { displayName: 'Maddie', ageBand: '3-5', readingLevel: 'visual', avatarId: 'avatar.girl.3-5' }, TEST_NOW, ids);
    state = addChildProfile(state, { displayName: 'Nais', ageBand: '6-8', readingLevel: 'short-text', avatarId: 'avatar.girl.6-8' }, TEST_NOW, ids);
    const created = addCustomQuestTemplate(state, {
      worldId: 'world.gnome-village',
      title: 'La table du village',
      instruction: 'Pose les serviettes sur la table.',
      categoryId: 'family-help',
      illustrationId: 'quest.gnome-village.family-help',
      ageBands: ['3-5', '6-8'],
      readingLevel: 'visual',
      estimatedMinutes: 5,
      steps: [],
      requiresAdultHelp: false,
      defaultValidation: 'parent',
      rewardDefinitionId: 'reward.gnome-village.desk',
    }, TEST_NOW, ids);
    const template = created.state.customQuestTemplates[0]!;
    state = addQuestSchedule(created.state, {
      questTemplateId: template.id,
      questFamilyId: template.familyId,
      worldId: template.worldId,
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
    expect(state.schedules[0]).toMatchObject({ worldId: 'world.gnome-village', questFamilyId: template.familyId });
    const suspended = setScheduleSuspended(state, scheduleId, true, 'pause');
    const resumed = setScheduleSuspended(suspended, scheduleId, false, 'resume');
    const duplicated = duplicateQuestSchedule(resumed, scheduleId, '2026-07-20', 'duplicate', TEST_TODAY, ids);
    expect(duplicated.schedules).toHaveLength(2);
    const replaced = replaceQuestSchedule(duplicated, scheduleId, {
      questTemplateId: template.id,
      questFamilyId: template.familyId,
      worldId: template.worldId,
      childIds: [state.children[0]!.id],
      kind: 'one-off',
      startDate: '2026-07-18',
      dayMoment: 'morning',
      priority: 'required',
      validationMode: 'together',
    }, 'replace', TEST_TODAY, ids);
    expect(replaced.schedules.find((item) => item.id === scheduleId)?.isSuspended).toBe(true);
    expect(replaced.schedules.at(-1)).toMatchObject({ worldId: 'world.gnome-village', kind: 'one-off', validationMode: 'together' });
  });

  it('refuse une planification dont la quête et l’univers divergent', () => {
    const ids = new SequenceIds();
    const state = addChildProfile(createEmptyFamilyState(), { displayName: 'Maddie', ageBand: '3-5', readingLevel: 'visual', avatarId: 'avatar.girl.3-5' }, TEST_NOW, ids);
    const template = builtinQuestTemplates.find((candidate) => candidate.id === 'family.evening.pyjamas.3-5')!;
    expect(() => addQuestSchedule(state, {
      questTemplateId: template.id,
      questFamilyId: template.familyId,
      worldId: 'world.dragon-mountain',
      childIds: [state.children[0]!.id],
      kind: 'immediate',
      startDate: TEST_TODAY,
      dayMoment: 'anytime',
      priority: 'required',
      validationMode: 'parent',
    }, TEST_NOW, TEST_TODAY, ids)).toThrow(/correspondre/);
  });
});
