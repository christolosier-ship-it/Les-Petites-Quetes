import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { findQuestTemplate } from '../../content/quests/builtinQuests';

interface ParentTodayPanelProps {
  readonly app: FamilyAppController;
}

export function ParentTodayPanel({ app }: ParentTodayPanelProps) {
  const pending = app.state.occurrences.filter((item) => item.status === 'validation-requested');
  const open = app.state.occurrences.filter((item) =>
    ['available', 'started', 'upcoming', 'postponed'].includes(item.status),
  );
  const recent = app.state.occurrences
    .filter((item) => ['completed', 'ignored'].includes(item.status))
    .slice(-8)
    .reverse();

  function labels(occurrenceId: string) {
    const occurrence = app.state.occurrences.find((item) => item.id === occurrenceId)!;
    const quest = findQuestTemplate(occurrence.questTemplateId, app.state.customQuestTemplates);
    const child = app.state.children.find((item) => item.id === occurrence.childId);
    return { occurrence, quest, child };
  }

  return (
    <div className="stack">
      <section className="stack" aria-labelledby="validation-title">
        <div><p className="eyebrow">À regarder</p><h3 id="validation-title">Demandes de validation</h3></div>
        {pending.length === 0 && <Card><p>Aucune demande en attente. Le sentier est calme.</p></Card>}
        {pending.map((item) => {
          const { quest, child } = labels(item.id);
          return (
            <Card key={item.id} className="action-card">
              <div><strong>{quest?.title ?? 'Quête'}</strong><p>{child?.displayName} · {quest?.instruction}</p></div>
              <div className="button-row">
                <Button onClick={() => void app.approveQuest(item.id)}>Valider</Button>
                <Button variant="secondary" onClick={() => void app.requestJointReview(item.id)}>Regarder ensemble</Button>
                <Button variant="quiet" onClick={() => void app.requestAnotherStep(item.id)}>Petite étape restante</Button>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="stack" aria-labelledby="planned-title">
        <div><p className="eyebrow">Calendrier léger</p><h3 id="planned-title">Quêtes ouvertes</h3></div>
        {open.length === 0 && <Card><p>Aucune quête ouverte.</p></Card>}
        {open.slice(0, 12).map((item) => {
          const { quest, child } = labels(item.id);
          return (
            <Card key={item.id} className="list-card">
              <div><strong>{quest?.title ?? 'Quête'}</strong><p>{child?.displayName} · {item.localDate} · {item.status}</p></div>
              <div className="button-row">
                <Button variant="quiet" onClick={() => void app.postponeQuest(item.id)}>Demain</Button>
                <Button variant="quiet" onClick={() => void app.ignoreQuest(item.id)}>Laisser de côté</Button>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="stack" aria-labelledby="history-title">
        <div><p className="eyebrow">Historique</p><h3 id="history-title">Derniers passages</h3></div>
        <div className="compact-list">
          {recent.map((item) => {
            const { quest, child } = labels(item.id);
            return <p key={item.id}><strong>{child?.displayName}</strong> · {quest?.title} · {item.status === 'completed' ? 'terminée' : 'laissée de côté'}</p>;
          })}
        </div>
      </section>
    </div>
  );
}
