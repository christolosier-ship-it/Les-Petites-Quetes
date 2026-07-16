import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import type { QuestTemplate } from '../../domain/quest/QuestTemplate';
import { QuestScheduleForm } from './QuestScheduleForm';
import {
  draftFromTemplate,
  inputFromDraft,
  QuestTemplateFields,
  type QuestTemplateDraft,
} from './QuestTemplateFields';

interface CustomQuestManagerProps {
  readonly app: FamilyAppController;
}

export function CustomQuestManager({ app }: CustomQuestManagerProps) {
  const [editing, setEditing] = useState<QuestTemplate>();
  const [scheduling, setScheduling] = useState<QuestTemplate>();
  const [draft, setDraft] = useState<QuestTemplateDraft>(() => draftFromTemplate());
  const active = app.state.customQuestTemplates.filter((template) => !template.isArchived && template.deletedAt === undefined);
  const archived = app.state.customQuestTemplates.filter((template) => template.isArchived && template.deletedAt === undefined);

  function startEdit(template: QuestTemplate) {
    setEditing(template);
    setDraft(draftFromTemplate(template));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    await app.updateCustomQuest(editing.id, inputFromDraft(draft));
    setEditing(undefined);
  }

  if (scheduling) {
    return (
      <Card className="editor-card">
        <p className="eyebrow">Planifier un modèle familial</p><h3>{scheduling.title}</h3>
        <QuestScheduleForm app={app} template={scheduling} onDone={() => setScheduling(undefined)} />
      </Card>
    );
  }

  if (editing) {
    return (
      <Card className="editor-card">
        <p className="eyebrow">Modifier le modèle familial</p><h3>{editing.title}</h3>
        <form className="form-grid" onSubmit={(event) => void save(event)}>
          <QuestTemplateFields draft={draft} onChange={setDraft} />
          <div className="button-row"><Button type="submit">Enregistrer</Button><Button variant="quiet" onClick={() => setEditing(undefined)}>Annuler</Button></div>
        </form>
      </Card>
    );
  }

  return (
    <section className="stack" aria-labelledby="custom-quests-title">
      <div><p className="eyebrow">Famille</p><h3 id="custom-quests-title">Mes modèles personnalisés</h3></div>
      {active.length === 0 && <Card><p>Aucun modèle familial. Personnalise une idée de la bibliothèque ou crée une quête depuis zéro.</p></Card>}
      {active.map((template) => (
        <Card key={template.id} className="list-card">
          <div><strong>{template.title}</strong><p>{template.instruction}</p></div>
          <div className="button-row"><Button variant="secondary" onClick={() => setScheduling(template)}>Planifier</Button><Button variant="quiet" onClick={() => startEdit(template)}>Modifier</Button><Button variant="quiet" onClick={() => void app.archiveCustomQuest(template.id)}>Archiver</Button></div>
        </Card>
      ))}
      {archived.length > 0 && <div className="stack"><h4>Modèles archivés</h4>{archived.map((template) => <Card key={template.id} className="list-card"><div><strong>{template.title}</strong><p>Conservé dans les sauvegardes.</p></div><Button variant="secondary" onClick={() => void app.restoreCustomQuest(template.id)}>Restaurer</Button></Card>)}</div>}
    </section>
  );
}
