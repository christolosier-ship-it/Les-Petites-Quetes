import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { findQuestTemplate } from '../../content/quests/builtinQuests';
import type { QuestOccurrence } from '../../domain/completion/QuestOccurrenceTypes';

interface ParentTodayPanelProps {
  readonly app: FamilyAppController;
}

const statusLabels: Readonly<Record<QuestOccurrence['status'], string>> = {
  upcoming: 'à venir',
  available: 'disponible',
  started: 'commencée',
  'validation-requested': 'validation demandée',
  completed: 'terminée',
  postponed: 'reportée',
  ignored: 'laissée de côté',
};

export function ParentTodayPanel({ app }: ParentTodayPanelProps) {
  const activeSchedule = (item: QuestOccurrence) => {
    const schedule = app.state.schedules.find((candidate) => candidate.id === item.scheduleId);
    return schedule !== undefined && !schedule.isSuspended && schedule.deletedAt === undefined;
  };
  const pending = app.state.occurrences.filter(
    (item) => item.deletedAt === undefined && item.status === 'validation-requested',
  );
  const open = app.state.occurrences.filter(
    (item) => item.deletedAt === undefined && activeSchedule(item) &&
      ['available', 'started', 'upcoming', 'postponed'].includes(item.status),
  );
  const recent = app.state.occurrences
    .filter((item) => item.deletedAt === undefined && ['completed', 'ignored'].includes(item.status))
    .slice(-12)
    .reverse();

  function labels(occurrence: QuestOccurrence) {
    const quest = findQuestTemplate(occurrence.questTemplateId, app.state.customQuestTemplates);
    const child = app.state.children.find((item) => item.id === occurrence.childId);
    return { quest, child };
  }

  return (
    <div className="stack">
      <section className="stack" aria-labelledby="validation-title">
        <div><p className="eyebrow">À regarder</p><h3 id="validation-title">Demandes de validation</h3></div>
        {pending.length === 0 && <Card><p>Aucune demande en attente. Le sentier est calme.</p></Card>}
        {pending.map((item) => {
          const { quest, child } = labels(item);
          const requestedAt = item.validationRequestedAt
            ? new Date(item.validationRequestedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            : 'heure inconnue';
          return (
            <Card key={item.id} className="action-card">
              <div><strong>{quest?.title ?? 'Quête'}</strong><p>{child?.displayName} · demande à {requestedAt}</p><small>{quest?.instruction}</small></div>
              <div className="button-row"><Button onClick={() => void app.approveQuest(item.id)}>Valider</Button><Button variant="secondary" onClick={() => void app.requestJointReview(item.id)}>Regarder ensemble</Button><Button variant="quiet" onClick={() => void app.requestAnotherStep(item.id)}>Petite étape restante</Button></div>
            </Card>
          );
        })}
      </section>

      <section className="stack" aria-labelledby="planned-title">
        <div><p className="eyebrow">Calendrier léger</p><h3 id="planned-title">Quêtes ouvertes</h3></div>
        {open.length === 0 && <Card><p>Aucune quête ouverte.</p></Card>}
        {open.slice(0, 20).map((item) => {
          const { quest, child } = labels(item);
          return (
            <Card key={item.id} className="list-card">
              <div><strong>{quest?.title ?? 'Quête'}</strong><p>{child?.displayName} · {item.localDate} · {statusLabels[item.status]}</p></div>
              <div className="button-row"><Button variant="quiet" onClick={() => void app.postponeQuest(item.id)}>Demain</Button><Button variant="quiet" onClick={() => void app.ignoreQuest(item.id)}>Laisser de côté</Button></div>
            </Card>
          );
        })}
      </section>

      <section className="stack" aria-labelledby="history-title">
        <div><p className="eyebrow">Historique</p><h3 id="history-title">Derniers passages</h3></div>
        <div className="compact-list">{recent.length === 0 ? <p>Aucun passage enregistré.</p> : recent.map((item) => { const { quest, child } = labels(item); return <p key={item.id}><strong>{child?.displayName}</strong> · {quest?.title} · {statusLabels[item.status]}</p>; })}</div>
      </section>
    </div>
  );
}
