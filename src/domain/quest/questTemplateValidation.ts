import { assertDomain } from '../shared/errors';
import {
  AGE_BANDS,
  QUEST_CATEGORIES,
  READING_LEVELS,
  VALIDATION_MODES,
  belongsTo,
  type AgeBand,
} from '../shared/types';
import { isWorldId } from '../world/WorldDefinition';
import { hasDuplicates, requireIdentifier, requireText, wordCount } from '../shared/validation';
import type { QuestStep, QuestTemplateInput } from './QuestTemplateTypes';

const MAX_DURATION_MINUTES = 180;
const MAX_PARENT_NOTE_LENGTH = 500;
const MAX_STEPS_DEFAULT = 8;
const MAX_STEPS_FOR_6_TO_8 = 3;

type NormalizedQuestTemplateInput = QuestTemplateInput & { readonly steps: readonly QuestStep[] };

const TITLE_WORD_LIMIT: Readonly<Record<AgeBand, number>> = { '3-5': 5, '6-8': 7, '9-10': 8 };
const INSTRUCTION_WORD_LIMIT: Readonly<Record<AgeBand, number>> = { '3-5': 12, '6-8': 20, '9-10': 30 };

function lowestLimit(ageBands: readonly AgeBand[], limits: Readonly<Record<AgeBand, number>>): number {
  return Math.min(...ageBands.map((ageBand) => limits[ageBand]));
}

function validateAgeBands(ageBands: readonly AgeBand[]): readonly AgeBand[] {
  assertDomain(ageBands.length > 0, 'quest.age-band-required', 'Une quête doit cibler au moins une tranche d’âge.', 'ageBands');
  assertDomain(!hasDuplicates(ageBands), 'quest.age-band-duplicated', 'Une tranche d’âge ne peut apparaître qu’une fois.', 'ageBands');
  for (const ageBand of ageBands) {
    assertDomain(belongsTo(ageBand, AGE_BANDS), 'quest.invalid-age-band', 'Une tranche d’âge de la quête est inconnue.', 'ageBands');
  }
  return [...ageBands];
}

function validateSteps(steps: readonly QuestStep[], ageBands: readonly AgeBand[]): readonly QuestStep[] {
  const maximum = ageBands.includes('6-8') ? MAX_STEPS_FOR_6_TO_8 : MAX_STEPS_DEFAULT;
  assertDomain(steps.length <= maximum, 'quest.too-many-steps', `Cette quête ne peut pas dépasser ${maximum} étapes pour les âges sélectionnés.`, 'steps');
  const normalized = steps.map((step, index) => ({
    id: requireIdentifier(step.id, 'quest.identifier-required', 'Chaque étape doit posséder un identifiant.', `steps.${index}.id`),
    instruction: requireText(step.instruction, 'quest.step-instruction-required', 'Chaque étape doit décrire une action.', `steps.${index}.instruction`),
  }));
  assertDomain(!hasDuplicates(normalized.map((step) => step.id)), 'quest.step-id-duplicated', 'Deux étapes ne peuvent pas partager le même identifiant.', 'steps');
  const instructionLimit = lowestLimit(ageBands, INSTRUCTION_WORD_LIMIT);
  for (const [index, step] of normalized.entries()) {
    assertDomain(wordCount(step.instruction) <= instructionLimit, 'quest.step-instruction-too-long', `Une étape ne peut pas dépasser ${instructionLimit} mots pour les âges sélectionnés.`, `steps.${index}.instruction`);
  }
  return normalized;
}

export function normalizeQuestTemplateInput(input: QuestTemplateInput): NormalizedQuestTemplateInput {
  const ageBands = validateAgeBands(input.ageBands);
  const title = requireText(input.title, 'quest.title-required', 'Un titre de quête est requis.', 'title');
  const instruction = requireText(input.instruction, 'quest.instruction-required', 'Une consigne enfant est requise.', 'instruction');
  const titleLimit = lowestLimit(ageBands, TITLE_WORD_LIMIT);
  const instructionLimit = lowestLimit(ageBands, INSTRUCTION_WORD_LIMIT);
  assertDomain(wordCount(title) <= titleLimit, 'quest.title-too-long', `Le titre ne peut pas dépasser ${titleLimit} mots pour les âges sélectionnés.`, 'title');
  assertDomain(wordCount(instruction) <= instructionLimit, 'quest.instruction-too-long', `La consigne ne peut pas dépasser ${instructionLimit} mots pour les âges sélectionnés.`, 'instruction');
  assertDomain(belongsTo(input.categoryId, QUEST_CATEGORIES), 'quest.invalid-category', 'La catégorie de quête est inconnue.', 'categoryId');
  assertDomain(belongsTo(input.readingLevel, READING_LEVELS), 'quest.invalid-reading-level', 'Le niveau de lecture de la quête est inconnu.', 'readingLevel');
  assertDomain(belongsTo(input.defaultValidation, VALIDATION_MODES), 'quest.invalid-validation-mode', 'Le mode de validation de la quête est inconnu.', 'defaultValidation');
  assertDomain(isWorldId(input.worldId), 'quest.invalid-world', 'L’univers de la quête est inconnu.', 'worldId');
  if (input.estimatedMinutes !== undefined) {
    assertDomain(Number.isInteger(input.estimatedMinutes) && input.estimatedMinutes > 0 && input.estimatedMinutes <= MAX_DURATION_MINUTES, 'quest.invalid-duration', `La durée doit être comprise entre 1 et ${MAX_DURATION_MINUTES} minutes.`, 'estimatedMinutes');
  }
  const parentNote = input.parentNote?.trim();
  if (parentNote !== undefined) {
    assertDomain(parentNote.length <= MAX_PARENT_NOTE_LENGTH, 'quest.parent-note-too-long', `La note parent ne peut pas dépasser ${MAX_PARENT_NOTE_LENGTH} caractères.`, 'parentNote');
  }
  return {
    familyId: requireIdentifier(input.familyId, 'quest.identifier-required', 'Une famille de quête est requise.', 'familyId'),
    worldId: input.worldId,
    title,
    instruction,
    categoryId: input.categoryId,
    illustrationId: requireIdentifier(input.illustrationId, 'quest.identifier-required', 'Une illustration est requise.', 'illustrationId'),
    ageBands,
    readingLevel: input.readingLevel,
    ...(input.estimatedMinutes !== undefined ? { estimatedMinutes: input.estimatedMinutes } : {}),
    steps: validateSteps(input.steps ?? [], ageBands),
    requiresAdultHelp: input.requiresAdultHelp,
    defaultValidation: input.defaultValidation,
    rewardDefinitionId: requireIdentifier(input.rewardDefinitionId, 'quest.identifier-required', 'Une récompense narrative est requise.', 'rewardDefinitionId'),
    ...(parentNote !== undefined && parentNote.length > 0 ? { parentNote } : {}),
  };
}
