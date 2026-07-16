import { describe, expect, it } from 'vitest';
import { DomainError, type DomainErrorCode } from '../shared/errors';
import type { QuestStep, QuestTemplateInput } from './QuestTemplateTypes';
import {
  archiveQuestTemplate,
  createBuiltinQuestTemplate,
  createCustomQuestTemplate,
  customizeQuestTemplate,
  restoreQuestTemplate,
  updateCustomQuestTemplate,
} from './QuestTemplate';

const input: QuestTemplateInput = {
  title: 'Les crocs du dragon',
  instruction: 'Brosse tes dents avec ta brosse.',
  categoryId: 'hygiene-routine',
  illustrationId: 'quest.brush-teeth',
  ageBands: ['3-5'],
  readingLevel: 'visual',
  estimatedMinutes: 3,
  steps: [{ id: 'brush', instruction: 'Brosse doucement toutes tes dents.' }],
  requiresAdultHelp: false,
  defaultValidation: 'parent',
  rewardDefinitionId: 'reward.firefly',
};

function expectDomainError(run: () => unknown, code: DomainErrorCode): void {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    if (error instanceof DomainError) expect(error.code).toBe(code);
    return;
  }
  throw new Error(`L’erreur métier ${code} était attendue.`);
}

describe('QuestTemplate', () => {
  it('crée un modèle personnalisé normalisé et immuable', () => {
    const template = createCustomQuestTemplate(
      { ...input, title: '  Les crocs du dragon  ' },
      { id: 'quest-1', createdAt: '2026-07-16T08:00:00.000Z' },
    );

    expect(template.title).toBe('Les crocs du dragon');
    expect(template.source).toBe('custom');
    expect(template.steps).toEqual([{ id: 'brush', instruction: 'Brosse doucement toutes tes dents.' }]);
    expect(template.revision).toBe(1);
  });

  it('applique les limites éditoriales de la tranche d’âge la plus jeune', () => {
    expectDomainError(
      () =>
        createCustomQuestTemplate(
          { ...input, title: 'Un très long titre de quête magique' },
          { id: 'quest-long-title', createdAt: 'now' },
        ),
      'quest.title-too-long',
    );
    expectDomainError(
      () =>
        createCustomQuestTemplate(
          {
            ...input,
            instruction:
              'Choisis calmement plusieurs objets différents puis range chacun dans sa boîte avant de revenir.',
          },
          { id: 'quest-long-instruction', createdAt: 'now' },
        ),
      'quest.instruction-too-long',
    );
  });

  it('refuse les tranches d’âge et les identifiants d’étapes dupliqués', () => {
    expectDomainError(
      () =>
        createCustomQuestTemplate(
          { ...input, ageBands: ['3-5', '3-5'] },
          { id: 'quest-duplicate-age', createdAt: 'now' },
        ),
      'quest.age-band-duplicated',
    );
    expectDomainError(
      () =>
        createCustomQuestTemplate(
          {
            ...input,
            steps: [
              { id: 'same', instruction: 'Prends la brosse.' },
              { id: 'same', instruction: 'Brosse tes dents.' },
            ],
          },
          { id: 'quest-duplicate-step', createdAt: 'now' },
        ),
      'quest.step-id-duplicated',
    );
  });

  it('limite à trois étapes les quêtes destinées aux 6 à 8 ans', () => {
    const steps: QuestStep[] = Array.from({ length: 4 }, (_, index) => ({
      id: `step-${index}`,
      instruction: `Réalise la petite étape ${index + 1}.`,
    }));
    expectDomainError(
      () =>
        createCustomQuestTemplate(
          { ...input, ageBands: ['6-8'], readingLevel: 'short-text', steps },
          { id: 'quest-too-many-steps', createdAt: 'now' },
        ),
      'quest.too-many-steps',
    );
  });

  it('refuse les durées, notes et versions de contenu incohérentes', () => {
    expectDomainError(
      () =>
        createCustomQuestTemplate(
          { ...input, estimatedMinutes: 0 },
          { id: 'quest-duration', createdAt: 'now' },
        ),
      'quest.invalid-duration',
    );
    expectDomainError(
      () =>
        createCustomQuestTemplate(
          { ...input, parentNote: 'x'.repeat(501) },
          { id: 'quest-note', createdAt: 'now' },
        ),
      'quest.parent-note-too-long',
    );
    expectDomainError(
      () =>
        createBuiltinQuestTemplate(input, {
          id: 'builtin-invalid-version',
          createdAt: 'now',
          contentVersion: '   ',
        }),
      'quest.content-version-required',
    );
  });

  it('interdit la modification directe d’un modèle intégré', () => {
    const builtin = createBuiltinQuestTemplate(input, {
      id: 'builtin-brush-teeth',
      createdAt: '2026-07-16T08:00:00.000Z',
      contentVersion: '1.0.0',
    });
    expectDomainError(
      () => updateCustomQuestTemplate(builtin, { title: 'Titre modifié' }, 'later'),
      'quest.builtin-readonly',
    );
  });

  it('personnalise un modèle intégré en créant une nouvelle copie custom', () => {
    const builtin = createBuiltinQuestTemplate(input, {
      id: 'builtin-brush-teeth',
      createdAt: '2026-07-16T08:00:00.000Z',
      contentVersion: '1.0.0',
    });
    const customized = customizeQuestTemplate(
      builtin,
      { title: 'Le sourire du dragon', estimatedMinutes: null },
      { id: 'custom-brush-teeth', createdAt: '2026-07-16T09:00:00.000Z' },
    );

    expect(customized.id).toBe('custom-brush-teeth');
    expect(customized.source).toBe('custom');
    expect(customized.contentVersion).toBeUndefined();
    expect(customized.estimatedMinutes).toBeUndefined();
    expect(builtin.title).toBe('Les crocs du dragon');
  });

  it('met à jour, archive et restaure une quête personnalisée sans mutation', () => {
    const original = createCustomQuestTemplate(
      { ...input, parentNote: 'Note initiale' },
      { id: 'quest-custom', createdAt: 'created' },
    );
    const updated = updateCustomQuestTemplate(
      original,
      { title: 'Le sourire du dragon', parentNote: null },
      'updated',
    );
    const archived = archiveQuestTemplate(updated, 'archived');
    const restored = restoreQuestTemplate(archived, 'restored');

    expect(original.title).toBe('Les crocs du dragon');
    expect(updated.title).toBe('Le sourire du dragon');
    expect(updated.parentNote).toBeUndefined();
    expect(archived.isArchived).toBe(true);
    expect(archiveQuestTemplate(archived, 'again')).toBe(archived);
    expect(restored.isArchived).toBe(false);
    expect(restored.revision).toBe(4);
  });
});
