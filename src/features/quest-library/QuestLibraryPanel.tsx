import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { getAsset, getAssetUrl } from '../../assets/registry/catalog';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { categoryLabels } from '../../content/copy/labels';
import { worldCatalog } from '../../content/world/worldCatalog';
import type { QuestTemplate } from '../../domain/quest/QuestTemplate';
import type { AgeBand, QuestCategoryId } from '../../domain/shared/types';
import type { WorldId } from '../../domain/world/WorldDefinition';
import { CustomQuestForm } from './CustomQuestForm';
import { CustomQuestManager } from './CustomQuestManager';
import { QuestScheduleForm } from './QuestScheduleForm';
import { RoutineManager } from './RoutineManager';

interface QuestLibraryPanelProps { readonly app: FamilyAppController; }
type QuestPanelMode = 'library' | 'custom' | 'routines';
type TemplateAction = 'schedule' | 'customize';

export function QuestLibraryPanel({ app }: QuestLibraryPanelProps) {
  const [mode, setMode] = useState<QuestPanelMode>('library');
  const [category, setCategory] = useState<'all' | QuestCategoryId>('all');
  const [worldId, setWorldId] = useState<'all' | WorldId>('all');
  const [ageBand, setAgeBand] = useState<AgeBand>(app.state.children.find((child) => child.id === app.state.settings.activeChildId)?.ageBand ?? '3-5');
  const [selected, setSelected] = useState<QuestTemplate>();
  const [action, setAction] = useState<TemplateAction>('schedule');
  const [customOpen, setCustomOpen] = useState(false);
  const templates = app.builtinTemplates.filter((template) =>
    template.ageBands.length === 1 && template.ageBands[0] === ageBand &&
    (worldId === 'all' || template.worldId === worldId) &&
    (category === 'all' || template.categoryId === category),
  );
  const reviewCount = app.state.questTemplateIdsNeedingWorldReview.length;

  function choose(template: QuestTemplate, nextAction: TemplateAction) {
    setSelected(template);
    setAction(nextAction);
  }

  if (selected !== undefined) {
    return <Card as="section" className="editor-card">{action === 'schedule' ? <><p className="eyebrow">Planification · {worldCatalog.find((world) => world.id === selected.worldId)?.name}</p><h3>{selected.title}</h3><p>{selected.instruction}</p><QuestScheduleForm app={app} template={selected} onDone={() => setSelected(undefined)} /></> : <CustomQuestForm app={app} sourceTemplate={selected} onDone={() => { setSelected(undefined); setMode('custom'); }} />}</Card>;
  }
  if (customOpen) return <Card as="section" className="editor-card"><CustomQuestForm app={app} onDone={() => { setCustomOpen(false); setMode('custom'); }} /></Card>;

  return (
    <div className="stack">
      <div className="subnav" role="navigation" aria-label="Gestion des quêtes"><Button variant={mode === 'library' ? 'secondary' : 'quiet'} onClick={() => setMode('library')}>Bibliothèque</Button><Button variant={mode === 'custom' ? 'secondary' : 'quiet'} onClick={() => setMode('custom')}>Mes modèles{reviewCount > 0 ? ` · ${reviewCount} à vérifier` : ''}</Button><Button variant={mode === 'routines' ? 'secondary' : 'quiet'} onClick={() => setMode('routines')}>Routines</Button></div>
      {mode === 'custom' && <><div className="section-heading"><div><p className="eyebrow">Créations familiales</p><h3>Mes modèles</h3></div><Button onClick={() => setCustomOpen(true)}>Créer une quête</Button></div>{reviewCount > 0 && <Card className="notice-card"><strong>{reviewCount} ancienne quête personnalisée à classer</strong><p>Ouvre-la puis choisis son univers. Aucun historique n’a été déplacé automatiquement.</p></Card>}<CustomQuestManager app={app} /></>}
      {mode === 'routines' && <RoutineManager app={app} />}
      {mode === 'library' && (
        <section className="stack" aria-labelledby="library-title">
          <div className="section-heading"><div><p className="eyebrow">30 familles · 90 variantes</p><h3 id="library-title">Bibliothèque de quêtes</h3></div><Button onClick={() => setCustomOpen(true)}>Créer depuis zéro</Button></div>
          <div className="filter-panel">
            <label>Univers<select value={worldId} onChange={(event) => setWorldId(event.target.value as 'all' | WorldId)}><option value="all">Tous les univers</option>{worldCatalog.map((world) => <option key={world.id} value={world.id}>{world.name}</option>)}</select></label>
            <label>Tranche d’âge<select value={ageBand} onChange={(event) => setAgeBand(event.target.value as AgeBand)}><option value="3-5">3 à 5 ans</option><option value="6-8">6 à 8 ans</option><option value="9-10">9 à 10 ans</option></select></label>
          </div>
          <div className="filter-row" role="group" aria-label="Filtrer par catégorie"><button className={category === 'all' ? 'chip chip--active' : 'chip'} type="button" onClick={() => setCategory('all')}>Toutes</button>{Object.entries(categoryLabels).map(([id, label]) => <button key={id} className={category === id ? 'chip chip--active' : 'chip'} type="button" onClick={() => setCategory(id as QuestCategoryId)}>{label}</button>)}</div>
          <div className="quest-library-grid">
            {templates.map((template) => {
              const asset = getAsset(template.illustrationId);
              const world = worldCatalog.find((candidate) => candidate.id === template.worldId)!;
              return <Card key={template.id} className="quest-template-card"><img src={getAssetUrl(asset.id)} alt={asset.alt} /><div><span className="category-tag">{world.shortName} · {ageBand} ans</span><h4>{template.title}</h4><p>{template.instruction}</p></div><div className="button-row"><Button variant="secondary" onClick={() => choose(template, 'schedule')}>Préparer</Button><Button variant="quiet" onClick={() => choose(template, 'customize')}>Personnaliser</Button></div></Card>;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
