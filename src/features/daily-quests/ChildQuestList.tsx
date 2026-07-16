import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { getAssetUrl } from '../../assets/registry/catalog';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { findQuestTemplate } from '../../content/quests/builtinQuests';
import type { QuestOccurrence } from '../../domain/completion/QuestOccurrenceTypes';
import { speakText } from '../../platform/audio/speakText';

interface ChildQuestListProps {
  readonly app: FamilyAppController;
  readonly childId: string;
}

export function ChildQuestList({ app, childId }: ChildQuestListProps) {
  const [selectedId, setSelectedId] = useState<string>();
  const [celebration, setCelebration] = useState('');
  const child = app.state.children.find((candidate) => candidate.id === childId);
  const occurrences = app.state.occurrences.filter(
    (item) => item.childId === childId && ['available', 'started', 'validation-requested'].includes(item.status),
  );
  const visible = occurrences.slice(0, child?.ageBand === '3-5' ? 3 : 6);
  const selected = occurrences.find((item) => item.id === selectedId);

  function templateFor(occurrence: QuestOccurrence) {
    return findQuestTemplate(occurrence.questTemplateId, app.state.customQuestTemplates);
  }

  async function finish(occurrence: QuestOccurrence) {
    const schedule = app.state.schedules.find((candidate) => candidate.id === occurrence.scheduleId);
    const completedImmediately = schedule?.validationMode === 'child';
    await app.finishQuest(occurrence.id);
    setSelectedId(undefined);
    setCelebration(
      completedImmediately
        ? 'Une nouvelle lumière rejoint la forêt !'
        : 'Ta demande est partie vers ton adulte.',
    );
  }

  if (selected !== undefined) {
    const template = templateFor(selected);
    if (!template) return null;
    return (
      <Card as="section" className="quest-detail" data-quest-detail>
        <img src={getAssetUrl(template.illustrationId)} alt="" />
        <p className="eyebrow">Petite quête</p>
        <h3>{template.title}</h3>
        <p className="quest-instruction">{template.instruction}</p>
        {template.steps.length > 0 && <ol>{template.steps.map((step) => <li key={step.id}>{step.instruction}</li>)}</ol>}
        <div className="child-action-grid">
          <Button variant="secondary" aria-label="Écouter la consigne" onClick={() => speakText(template.instruction, app.state.settings.narrationEnabled)}>🔊 Écouter</Button>
          {selected.status === 'available' && <Button data-action="start-quest" onClick={() => void app.startQuest(selected.id)}>▶️ Je commence</Button>}
          {selected.status !== 'validation-requested' && <Button data-action="finish-quest" onClick={() => void finish(selected)}>✨ J’ai terminé</Button>}
          {selected.status === 'validation-requested' && <p className="waiting-message">🧭 Un adulte va regarder avec toi.</p>}
          <Button variant="quiet" onClick={() => setSelectedId(undefined)}>Retour aux quêtes</Button>
        </div>
      </Card>
    );
  }

  return (
    <section className="stack" aria-labelledby="child-quests-title">
      <div><p className="eyebrow">Aujourd’hui</p><h3 id="child-quests-title">Mes petites quêtes</h3></div>
      {celebration && <Card className="celebration-card"><strong>✨ {celebration}</strong><Button variant="quiet" onClick={() => setCelebration('')}>D’accord</Button></Card>}
      {visible.length === 0 && <Card className="empty-card"><div aria-hidden="true">🌿</div><h4>Le sentier est tranquille</h4><p>Tu peux explorer ton monde ou revenir plus tard.</p></Card>}
      <div className="child-quest-grid">
        {visible.map((occurrence) => {
          const template = templateFor(occurrence);
          if (!template) return null;
          return (
            <button key={occurrence.id} className="child-quest-card" data-occurrence-id={occurrence.id} type="button" onClick={() => setSelectedId(occurrence.id)}>
              <img src={getAssetUrl(template.illustrationId)} alt="" />
              <span><strong>{template.title}</strong><small>{occurrence.status === 'validation-requested' ? 'En attente de ton adulte' : template.instruction}</small></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
