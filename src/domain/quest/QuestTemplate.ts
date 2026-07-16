import { createEntityMetadata, incrementRevision } from '../shared/entity';
import { assertDomain } from '../shared/errors';
import { requireText } from '../shared/validation';
import {
  type QuestTemplate,
  type QuestTemplateChanges,
  type QuestTemplateInput,
} from './QuestTemplateTypes';
import { normalizeQuestTemplateInput } from './questTemplateValidation';

export type {
  QuestStep,
  QuestTemplate,
  QuestTemplateChanges,
  QuestTemplateInput,
  QuestTemplateSource,
} from './QuestTemplateTypes';

interface QuestTemplateIdentity {
  readonly id: string;
  readonly createdAt: string;
}

function assertMutable(template: QuestTemplate): void {
  assertDomain(
    template.deletedAt === undefined,
    'quest.deleted-readonly',
    'Un modèle supprimé ne peut plus être modifié.',
  );
  assertDomain(
    !template.isArchived,
    'quest.archived-readonly',
    'Restaurez le modèle avant de le modifier.',
  );
  assertDomain(
    template.source === 'custom',
    'quest.builtin-readonly',
    'Un modèle intégré doit être personnalisé avant modification.',
  );
}

function buildInput(
  template: QuestTemplate,
  changes: QuestTemplateChanges,
): QuestTemplateInput {
  const estimatedMinutes =
    changes.estimatedMinutes === null
      ? undefined
      : (changes.estimatedMinutes ?? template.estimatedMinutes);
  const parentNote = changes.parentNote === null ? undefined : (changes.parentNote ?? template.parentNote);

  return {
    title: changes.title ?? template.title,
    instruction: changes.instruction ?? template.instruction,
    categoryId: changes.categoryId ?? template.categoryId,
    illustrationId: changes.illustrationId ?? template.illustrationId,
    ageBands: changes.ageBands ?? template.ageBands,
    readingLevel: changes.readingLevel ?? template.readingLevel,
    ...(estimatedMinutes !== undefined ? { estimatedMinutes } : {}),
    steps: changes.steps ?? template.steps,
    requiresAdultHelp: changes.requiresAdultHelp ?? template.requiresAdultHelp,
    defaultValidation: changes.defaultValidation ?? template.defaultValidation,
    rewardDefinitionId: changes.rewardDefinitionId ?? template.rewardDefinitionId,
    ...(parentNote !== undefined ? { parentNote } : {}),
  };
}

export function createCustomQuestTemplate(
  input: QuestTemplateInput,
  identity: QuestTemplateIdentity,
): QuestTemplate {
  return {
    ...createEntityMetadata(identity.id, identity.createdAt),
    ...normalizeQuestTemplateInput(input),
    source: 'custom',
    isArchived: false,
  };
}

export function createBuiltinQuestTemplate(
  input: QuestTemplateInput,
  identity: QuestTemplateIdentity & { readonly contentVersion: string },
): QuestTemplate {
  const contentVersion = requireText(
    identity.contentVersion,
    'quest.content-version-required',
    'Une version de contenu est requise pour un modèle intégré.',
    'contentVersion',
  );

  return {
    ...createEntityMetadata(identity.id, identity.createdAt),
    ...normalizeQuestTemplateInput(input),
    source: 'builtin',
    contentVersion,
    isArchived: false,
  };
}

export function customizeQuestTemplate(
  template: QuestTemplate,
  changes: QuestTemplateChanges,
  identity: QuestTemplateIdentity,
): QuestTemplate {
  assertDomain(
    template.deletedAt === undefined,
    'quest.deleted-readonly',
    'Un modèle supprimé ne peut pas être personnalisé.',
  );
  return createCustomQuestTemplate(buildInput(template, changes), identity);
}

export function updateCustomQuestTemplate(
  template: QuestTemplate,
  changes: QuestTemplateChanges,
  updatedAt: string,
): QuestTemplate {
  assertMutable(template);
  const normalized = normalizeQuestTemplateInput(buildInput(template, changes));

  return {
    ...template,
    ...normalized,
    ...incrementRevision(template, updatedAt),
  };
}

export function archiveQuestTemplate(
  template: QuestTemplate,
  updatedAt: string,
): QuestTemplate {
  if (template.isArchived) return template;
  assertMutable(template);

  return {
    ...template,
    isArchived: true,
    ...incrementRevision(template, updatedAt),
  };
}

export function restoreQuestTemplate(
  template: QuestTemplate,
  updatedAt: string,
): QuestTemplate {
  if (!template.isArchived) return template;
  assertDomain(
    template.deletedAt === undefined,
    'quest.deleted-readonly',
    'Un modèle supprimé ne peut pas être restauré.',
  );
  assertDomain(
    template.source === 'custom',
    'quest.builtin-readonly',
    'Un modèle intégré ne possède pas d’état utilisateur modifiable.',
  );

  return {
    ...template,
    isArchived: false,
    ...incrementRevision(template, updatedAt),
  };
}
