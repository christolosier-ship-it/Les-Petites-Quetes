import { describe, expect, it } from 'vitest';
import { DomainError, type DomainErrorCode } from '../shared/errors';
import {
  archiveQuestTemplate,
  createBuiltinQuestTemplate,
  createCustomQuestTemplate,
  customizeQuestTemplate,
  restoreQuestTemplate,
  updateCustomQuestTemplate,
  type QuestTemplateInput,
} from './QuestTemplate';

const input: QuestTemplateInput = {
  familyId: 'family.evening.brush-teeth',
  worldId: 'world.firefly-forest',
  title: 'Les dents brillantes',
  instruction: 'Brosse doucement toutes tes dents.',
  categoryId: 'hygiene-routine',
  illustrationId: 'quest.firefly.brush-teeth',
  ageBands: ['3-5'],
  readingLevel: 'visual',
  estimatedMinutes: 3,
  steps: [{ id: 'step-1', instruction: 'Prends ta brosse.' }],
  requiresAdultHelp: false,
  defaultValidation: 'parent',
  rewardDefinitionId: 'reward.firefly',
};

function expectDomainError(run: () => unknown, code: DomainErrorCode): void {
  try { run(); } catch (error) { expect(error).toBeInstanceOf(DomainError); if (error instanceof DomainError) expect(error.code).toBe(code); return; }
  throw new Error(`L’erreur métier ${code} était attendue.`);
}

describe('QuestTemplate V3', () => {
  it('crée une variante rattachée à une famille et un univers', () => {
    const template = createCustomQuestTemplate(input, { id: 'quest-1', createdAt: 'now' });
    expect(template).toMatchObject({ id: 'quest-1', familyId: 'family.evening.brush-teeth', worldId: 'world.firefly-forest', source: 'custom', ageBands: ['3-5'] });
  });

  it('refuse un univers inconnu même depuis un import non typé', () => {
    expectDomainError(
      () => createCustomQuestTemplate({ ...input, worldId: 'world.unknown' as typeof input.worldId }, { id: 'quest-2', createdAt: 'now' }),
      'quest.invalid-world',
    );
  });

  it('protège les modèles intégrés et crée une copie personnalisée', () => {
    const builtin = createBuiltinQuestTemplate(input, { id: 'builtin-1', createdAt: 'now', contentVersion: '3.0.0' });
    expectDomainError(() => updateCustomQuestTemplate(builtin, { title: 'Autre titre' }, 'later'), 'quest.builtin-readonly');
    const copy = customizeQuestTemplate(builtin, { title: 'Mes dents de lumière' }, { id: 'custom-1', createdAt: 'later' });
    expect(copy).toMatchObject({ id: 'custom-1', source: 'custom', familyId: input.familyId, worldId: input.worldId, title: 'Mes dents de lumière' });
  });

  it('met à jour, archive et restaure une quête personnalisée', () => {
    const template = createCustomQuestTemplate(input, { id: 'quest-1', createdAt: 'now' });
    const updated = updateCustomQuestTemplate(template, { parentNote: 'Préparer le matériel.', estimatedMinutes: 4 }, 'later');
    expect(updated).toMatchObject({ parentNote: 'Préparer le matériel.', estimatedMinutes: 4, revision: 2 });
    const archived = archiveQuestTemplate(updated, 'archive');
    expect(archived.isArchived).toBe(true);
    const restored = restoreQuestTemplate(archived, 'restore');
    expect(restored).toMatchObject({ isArchived: false, revision: 4 });
  });

  it('applique les limites éditoriales de la tranche la plus jeune', () => {
    expectDomainError(
      () => createCustomQuestTemplate({ ...input, title: 'Un titre beaucoup trop long pour ce mode' }, { id: 'quest-long', createdAt: 'now' }),
      'quest.title-too-long',
    );
  });
});
