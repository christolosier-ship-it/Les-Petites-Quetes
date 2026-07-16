import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { findQuestTemplate } from '../../content/quests/builtinQuests';
import { dayMomentLabels } from '../../content/copy/labels';
import type { QuestSchedule } from '../../domain/schedule/QuestSchedule';
import { SystemClock } from '../../platform/clock/SystemClock';
import { QuestScheduleForm } from './QuestScheduleForm';

const clock = new SystemClock();

interface RoutineManagerProps {
  readonly app: FamilyAppController;
}

export function RoutineManager({ app }: RoutineManagerProps) {
  const [editing, setEditing] = useState<QuestSchedule>();
  const schedules = app.state.schedules.filter((schedule) => schedule.deletedAt === undefined);

  if (editing !== undefined) {
    const template = findQuestTemplate(editing.questTemplateId, app.state.customQuestTemplates);
    if (!template) return <Card><p>Le modèle de cette routine est introuvable.</p></Card>;
    return (
      <Card as="section" className="editor-card">
        <p className="eyebrow">Modifier une routine</p><h3>{template.title}</h3>
        <p>La nouvelle configuration remplacera les occurrences encore ouvertes de l’ancienne routine.</p>
        <QuestScheduleForm app={app} template={template} existingSchedule={editing} onDone={() => setEditing(undefined)} />
      </Card>
    );
  }

  return (
    <section className="stack" aria-labelledby="routine-title">
      <div><p className="eyebrow">Organisation</p><h3 id="routine-title">Routines et planifications</h3></div>
      {schedules.length === 0 && <Card><p>Aucune routine enregistrée.</p></Card>}
      {schedules.map((schedule) => {
        const template = findQuestTemplate(schedule.questTemplateId, app.state.customQuestTemplates);
        const childNames = schedule.childIds.map((id) => app.state.children.find((child) => child.id === id)?.displayName ?? 'Profil inconnu');
        const recurrence = schedule.kind === 'weekly'
          ? `Chaque semaine · ${schedule.weekdays?.join(', ') ?? ''}`
          : schedule.kind === 'one-off' ? `Le ${schedule.startDate}` : 'Disponible immédiatement';
        return (
          <Card key={schedule.id} className="routine-card">
            <div>
              <strong>{template?.title ?? 'Quête inconnue'}</strong>
              <p>{childNames.join(', ')} · {recurrence}</p>
              <small>{dayMomentLabels[schedule.dayMoment]}{schedule.exactTime ? ` · ${schedule.exactTime}` : ''} · {schedule.priority === 'optional' ? 'Facultative' : 'Prioritaire'}</small>
            </div>
            <div className="button-row">
              <Button variant="quiet" onClick={() => setEditing(schedule)}>Modifier</Button>
              <Button variant="quiet" onClick={() => void app.setScheduleSuspended(schedule.id, !schedule.isSuspended)}>{schedule.isSuspended ? 'Reprendre' : 'Mettre en pause'}</Button>
              <Button variant="quiet" onClick={() => void app.duplicateSchedule(schedule.id, clock.todayLocal())}>Dupliquer</Button>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
