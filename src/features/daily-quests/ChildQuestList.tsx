import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { getAsset, getAssetUrl } from '../../assets/registry/catalog';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { findQuestTemplate } from '../../content/quests/builtinQuests';
import type { QuestOccurrence } from '../../domain/completion/QuestOccurrenceTypes';
import type { WorldId } from '../../domain/world/WorldDefinition';
import { speakText } from '../../platform/audio/speakText';

interface ChildQuestListProps {
  readonly app: FamilyAppController;
  readonly childId: string;
  readonly worldId: WorldId;
}

export function ChildQuestList({ app, childId, worldId }: ChildQuestListProps) {
  const [selectedId, setSelectedId] = useState<string>();
  const [stepIndex, setStepIndex] = useState(0);
  const [notice, setNotice] = useState('');
  const child = app.state.children.find((candidate) => candidate.id === childId);
  const scheduleFor = (occurrence: QuestOccurrence) => app.state.schedules.find((candidate) => candidate.id === occurrence.scheduleId);
  const occurrences = app.state.occurrences
    .filter((item) => {
      const schedule = scheduleFor(item);
      return item.childId === childId && item.worldId === worldId && item.deletedAt === undefined && !schedule?.isSuspended && ['available', 'started', 'validation-requested'].includes(item.status);
    })
    .sort((left, right) => {
      const leftOptional = scheduleFor(left)?.priority === 'optional' ? 1 : 0;
      const rightOptional = scheduleFor(right)?.priority === 'optional' ? 1 : 0;
      return leftOptional - rightOptional || left.localDate.localeCompare(right.localDate);
    });
  const visible = occurrences.slice(0, child?.ageBand === '3-5' ? 3 : 6);
  const selected = occurrences.find((item) => item.id === selectedId);
  const templateFor = (occurrence: QuestOccurrence) => findQuestTemplate(occurrence.questTemplateId, app.state.customQuestTemplates);

  function openQuest(occurrenceId: string) {
    setSelectedId(occurrenceId);
    setStepIndex(0);
    setNotice('');
  }

  async function finish(occurrence: QuestOccurrence) {
    const schedule = scheduleFor(occurrence);
    await app.finishQuest(occurrence.id);
    setSelectedId(undefined);
    if (schedule?.validationMode !== 'child') setNotice('Ta demande est partie vers ton adulte. Tu peux retourner jouer.');
  }

  if (selected !== undefined) {
    const template = templateFor(selected);
    if (!template) return null;
    const asset = getAsset(template.illustrationId);
    const schedule = scheduleFor(selected);
    const currentStep = child?.ageBand === '3-5' ? template.steps[stepIndex] : undefined;
    return (
      <Card as="section" className="quest-detail" data-quest-detail>
        <img src={getAssetUrl(asset.id)} alt={asset.alt} />
        <p className="eyebrow">{schedule?.priority === 'optional' ? 'Quête à choisir' : 'Petite quête'}</p>
        <h3>{template.title}</h3><p className="quest-instruction">{template.instruction}</p>
        {currentStep && <Card className="single-step"><strong>Étape {stepIndex + 1}</strong><p>{currentStep.instruction}</p>{stepIndex < template.steps.length - 1 && <Button variant="secondary" onClick={() => setStepIndex((current) => current + 1)}>Étape suivante</Button>}</Card>}
        {child?.ageBand !== '3-5' && template.steps.length > 0 && <ol>{template.steps.map((step) => <li key={step.id}>{step.instruction}</li>)}</ol>}
        {template.requiresAdultHelp && <p className="help-message">🤝 Cette quête se fait avec un adulte.</p>}
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
      <div><p className="eyebrow">Dans cet univers</p><h3 id="child-quests-title">Mes petites quêtes</h3></div>
      {notice && <Card className="notice-card"><strong>🧭 {notice}</strong><Button variant="quiet" onClick={() => setNotice('')}>D’accord</Button></Card>}
      {visible.length === 0 && <Card className="empty-card"><div aria-hidden="true">🌿</div><h4>Tout est tranquille ici</h4><p>Choisis un autre univers ou reviens plus tard.</p></Card>}
      <div className="child-quest-grid">
        {visible.map((occurrence) => {
          const template = templateFor(occurrence);
          const schedule = scheduleFor(occurrence);
          if (!template) return null;
          const asset = getAsset(template.illustrationId);
          const optional = schedule?.priority === 'optional';
          return <button key={occurrence.id} className={optional ? 'child-quest-card child-quest-card--optional' : 'child-quest-card'} data-occurrence-id={occurrence.id} type="button" onClick={() => openQuest(occurrence.id)}><img src={getAssetUrl(asset.id)} alt={asset.alt} /><span>{optional && <em>🌱 À choisir</em>}<strong>{template.title}</strong><small>{occurrence.status === 'validation-requested' ? 'En attente de ton adulte' : template.instruction}</small></span></button>;
        })}
      </div>
    </section>
  );
}
