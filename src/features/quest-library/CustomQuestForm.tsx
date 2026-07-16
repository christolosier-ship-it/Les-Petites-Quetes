import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { Button } from '../../components/primitives/Button';
import { Field } from '../../components/primitives/Field';
import { categoryLabels } from '../../content/copy/labels';
import type { QuestCategoryId, ValidationMode } from '../../domain/shared/types';
import { SystemClock } from '../../platform/clock/SystemClock';

const clock = new SystemClock();
const illustrationByCategory: Readonly<Record<QuestCategoryId, string>> = {
  autonomy: 'quest.autonomy', 'hygiene-routine': 'quest.hygiene', 'family-help': 'quest.family',
  creativity: 'quest.creativity', discovery: 'quest.discovery', wellbeing: 'quest.wellbeing',
  kindness: 'quest.kindness', 'special-adventure': 'quest.adventure',
};

interface CustomQuestFormProps {
  readonly app: FamilyAppController;
  readonly onDone: () => void;
}

export function CustomQuestForm({ app, onDone }: CustomQuestFormProps) {
  const children = app.state.children.filter((child) => !child.isArchived && child.deletedAt === undefined);
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [category, setCategory] = useState<QuestCategoryId>('autonomy');
  const [childId, setChildId] = useState(app.state.settings.activeChildId ?? children[0]?.id ?? '');
  const [kind, setKind] = useState<'immediate' | 'one-off'>('immediate');
  const [date, setDate] = useState(clock.todayLocal());
  const [validation, setValidation] = useState<ValidationMode>(app.state.settings.defaultValidationMode);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const child = children.find((candidate) => candidate.id === childId);
    if (!child) return;
    await app.createCustomQuest(
      {
        title,
        instruction,
        categoryId: category,
        illustrationId: illustrationByCategory[category],
        ageBands: [child.ageBand],
        readingLevel: child.readingLevel,
        estimatedMinutes: 10,
        steps: [],
        requiresAdultHelp: false,
        defaultValidation: validation,
        rewardDefinitionId: 'reward.lantern',
      },
      {
        childIds: [childId],
        kind,
        startDate: kind === 'immediate' ? clock.todayLocal() : date,
        dayMoment: 'anytime',
        priority: 'required',
        validationMode: validation,
      },
    );
    onDone();
  }

  if (children.length === 0) return <p>Crée d’abord un profil enfant.</p>;

  return (
    <form className="form-grid" onSubmit={(event) => void submit(event)}>
      <Field label="Titre d’aventure"><input value={title} required onChange={(event) => setTitle(event.target.value)} placeholder="La mission des chaussettes" /></Field>
      <Field label="Consigne courte" hint="Commence par un verbe et décris une seule action."><textarea value={instruction} required rows={3} onChange={(event) => setInstruction(event.target.value)} /></Field>
      <Field label="Catégorie"><select value={category} onChange={(event) => setCategory(event.target.value as QuestCategoryId)}>{Object.entries(categoryLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
      <Field label="Enfant"><select value={childId} onChange={(event) => setChildId(event.target.value)}>{children.map((child) => <option key={child.id} value={child.id}>{child.displayName}</option>)}</select></Field>
      <Field label="Quand ?"><select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="immediate">Maintenant</option><option value="one-off">À une date</option></select></Field>
      {kind === 'one-off' && <Field label="Date"><input type="date" value={date} required onChange={(event) => setDate(event.target.value)} /></Field>}
      <Field label="Validation"><select value={validation} onChange={(event) => setValidation(event.target.value as ValidationMode)}><option value="child">Immédiate</option><option value="parent">Par un parent</option><option value="together">Ensemble</option></select></Field>
      <div className="button-row"><Button type="submit">Créer et planifier</Button><Button variant="quiet" onClick={onDone}>Annuler</Button></div>
    </form>
  );
}
