import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import type { QuestTemplate } from '../../domain/quest/QuestTemplate';
import {
  draftFromTemplate,
  inputFromDraft,
  QuestTemplateFields,
} from './QuestTemplateFields';
import {
  createScheduleDraft,
  scheduleInputFromDraft,
  ScheduleDraftFields,
} from './ScheduleDraftFields';

interface CustomQuestFormProps {
  readonly app: FamilyAppController;
  readonly sourceTemplate?: QuestTemplate;
  readonly onDone: () => void;
}

export function CustomQuestForm({ app, sourceTemplate, onDone }: CustomQuestFormProps) {
  const children = app.state.children.filter((child) => !child.isArchived && child.deletedAt === undefined);
  const defaultChildId = app.state.settings.activeChildId ?? children[0]?.id ?? '';
  const [templateDraft, setTemplateDraft] = useState(() => draftFromTemplate(sourceTemplate));
  const [scheduleDraft, setScheduleDraft] = useState(() => createScheduleDraft(
    defaultChildId,
    sourceTemplate?.defaultValidation ?? app.state.settings.defaultValidationMode,
  ));
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    if (templateDraft.ageBands.length === 0 || scheduleDraft.childIds.length === 0) {
      setMessage('Choisis au moins une tranche d’âge et un enfant.');
      return;
    }
    try {
      const input = inputFromDraft(templateDraft);
      const schedule = scheduleInputFromDraft({
        ...scheduleDraft,
        validationMode: scheduleDraft.validationMode,
      });
      if (sourceTemplate?.source === 'builtin') {
        await app.customizeBuiltinQuest(sourceTemplate.id, input, schedule);
      } else {
        await app.createCustomQuest(input, schedule);
      }
      onDone();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Création impossible.');
    }
  }

  if (children.length === 0) return <p>Crée d’abord un profil enfant.</p>;

  return (
    <form className="form-grid" onSubmit={(event) => void submit(event)}>
      <p className="eyebrow">{sourceTemplate ? 'Personnaliser le modèle' : 'Créer depuis zéro'}</p>
      <QuestTemplateFields draft={templateDraft} onChange={setTemplateDraft} />
      <hr className="form-separator" />
      <h4>Planification</h4>
      <ScheduleDraftFields
        draft={scheduleDraft}
        childOptions={children.map((child) => ({ id: child.id, label: child.displayName }))}
        onChange={setScheduleDraft}
      />
      {message && <p className="form-message" role="alert">{message}</p>}
      <div className="button-row"><Button type="submit">Créer et planifier</Button><Button variant="quiet" onClick={onDone}>Annuler</Button></div>
    </form>
  );
}
