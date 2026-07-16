import { Field } from '../../components/primitives/Field';
import { categoryLabels, validationLabels } from '../../content/copy/labels';
import { defaultRewardForWorld, rewardsForWorld, worldCatalog } from '../../content/world/worldCatalog';
import type { QuestTemplate, QuestTemplateInput } from '../../domain/quest/QuestTemplate';
import type { AgeBand, QuestCategoryId, ReadingLevel, ValidationMode } from '../../domain/shared/types';
import type { WorldId } from '../../domain/world/WorldDefinition';

export interface QuestTemplateDraft {
  readonly worldId: WorldId;
  readonly title: string;
  readonly instruction: string;
  readonly categoryId: QuestCategoryId;
  readonly ageBands: readonly AgeBand[];
  readonly readingLevel: ReadingLevel;
  readonly estimatedMinutes: string;
  readonly stepsText: string;
  readonly requiresAdultHelp: boolean;
  readonly defaultValidation: ValidationMode;
  readonly rewardDefinitionId: string;
  readonly parentNote: string;
}

export function draftFromTemplate(template?: QuestTemplate): QuestTemplateDraft {
  const worldId = template?.worldId ?? 'world.firefly-forest';
  return {
    worldId,
    title: template?.title ?? '',
    instruction: template?.instruction ?? '',
    categoryId: template?.categoryId ?? 'autonomy',
    ageBands: template?.ageBands ?? ['3-5'],
    readingLevel: template?.readingLevel ?? 'visual',
    estimatedMinutes: String(template?.estimatedMinutes ?? 10),
    stepsText: template?.steps.map((step) => step.instruction).join('\n') ?? '',
    requiresAdultHelp: template?.requiresAdultHelp ?? false,
    defaultValidation: template?.defaultValidation ?? 'parent',
    rewardDefinitionId: template?.rewardDefinitionId ?? defaultRewardForWorld(worldId),
    parentNote: template?.parentNote ?? '',
  };
}

export function inputFromDraft(draft: QuestTemplateDraft): Omit<QuestTemplateInput, 'familyId'> {
  const steps = draft.stepsText.split('\n').map((instruction) => instruction.trim()).filter(Boolean).map((instruction, index) => ({ id: `step-${index + 1}`, instruction }));
  return {
    worldId: draft.worldId,
    title: draft.title,
    instruction: draft.instruction,
    categoryId: draft.categoryId,
    illustrationId: `quest.${draft.worldId.slice(6)}.${draft.categoryId}`,
    ageBands: draft.ageBands,
    readingLevel: draft.readingLevel,
    estimatedMinutes: Number(draft.estimatedMinutes),
    steps,
    requiresAdultHelp: draft.requiresAdultHelp,
    defaultValidation: draft.defaultValidation,
    rewardDefinitionId: draft.rewardDefinitionId,
    ...(draft.parentNote.trim() !== '' ? { parentNote: draft.parentNote } : {}),
  };
}

export function QuestTemplateFields({ draft, onChange }: { readonly draft: QuestTemplateDraft; readonly onChange: (draft: QuestTemplateDraft) => void }) {
  function toggleAge(age: AgeBand) {
    onChange({ ...draft, ageBands: draft.ageBands.includes(age) ? draft.ageBands.filter((candidate) => candidate !== age) : [...draft.ageBands, age] });
  }
  function changeWorld(worldId: WorldId) {
    onChange({ ...draft, worldId, rewardDefinitionId: defaultRewardForWorld(worldId) });
  }
  return (
    <>
      <Field label="Univers"><select value={draft.worldId} onChange={(event) => changeWorld(event.target.value as WorldId)}>{worldCatalog.map((world) => <option key={world.id} value={world.id}>{world.name}</option>)}</select></Field>
      <Field label="Titre d’aventure"><input value={draft.title} required onChange={(event) => onChange({ ...draft, title: event.target.value })} /></Field>
      <Field label="Consigne courte" hint="Commence par un verbe et décris une seule action."><textarea value={draft.instruction} required rows={3} onChange={(event) => onChange({ ...draft, instruction: event.target.value })} /></Field>
      <Field label="Catégorie"><select value={draft.categoryId} onChange={(event) => onChange({ ...draft, categoryId: event.target.value as QuestCategoryId })}>{Object.entries(categoryLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
      <fieldset className="choice-grid"><legend>Tranches d’âge</legend>{(['3-5', '6-8', '9-10'] as const).map((age) => <label key={age}><input type="checkbox" checked={draft.ageBands.includes(age)} onChange={() => toggleAge(age)} />{age} ans</label>)}</fieldset>
      <Field label="Niveau de lecture"><select value={draft.readingLevel} onChange={(event) => onChange({ ...draft, readingLevel: event.target.value as ReadingLevel })}><option value="visual">Principalement visuel</option><option value="short-text">Phrases courtes</option><option value="independent">Lecture autonome</option></select></Field>
      <Field label="Durée indicative"><input type="number" min="1" max="180" value={draft.estimatedMinutes} onChange={(event) => onChange({ ...draft, estimatedMinutes: event.target.value })} /></Field>
      <Field label="Étapes facultatives" hint="Une étape par ligne."><textarea rows={4} value={draft.stepsText} onChange={(event) => onChange({ ...draft, stepsText: event.target.value })} /></Field>
      <label className="toggle-row"><span>Une aide adulte est nécessaire</span><input type="checkbox" checked={draft.requiresAdultHelp} onChange={(event) => onChange({ ...draft, requiresAdultHelp: event.target.checked })} /></label>
      <Field label="Validation proposée"><select value={draft.defaultValidation} onChange={(event) => onChange({ ...draft, defaultValidation: event.target.value as ValidationMode })}>{Object.entries(validationLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
      <Field label="Récompense de cet univers"><select value={draft.rewardDefinitionId} onChange={(event) => onChange({ ...draft, rewardDefinitionId: event.target.value })}>{rewardsForWorld(draft.worldId).map((reward) => <option key={reward.id} value={reward.id}>{reward.label}</option>)}</select></Field>
      <Field label="Note réservée au parent"><textarea rows={2} maxLength={500} value={draft.parentNote} onChange={(event) => onChange({ ...draft, parentNote: event.target.value })} /></Field>
    </>
  );
}
