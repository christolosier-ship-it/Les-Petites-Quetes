import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Card } from '../../components/primitives/Card';
import { worldCatalog } from '../../content/world/worldCatalog';
import type { WorldId } from '../../domain/world/WorldDefinition';
import { WorldView } from './WorldView';

interface ParentWorldsPanelProps { readonly app: FamilyAppController; }

export function ParentWorldsPanel({ app }: ParentWorldsPanelProps) {
  const childId = app.state.settings.activeChildId ?? app.state.children.find((child) => !child.isArchived)?.id;
  const [worldId, setWorldId] = useState<WorldId>('world.firefly-forest');
  if (!childId) return <Card><p>Crée un profil pour suivre les univers.</p></Card>;
  return (
    <div className="stack">
      <div className="filter-row" role="group" aria-label="Choisir un univers">{worldCatalog.map((world) => {
        const progress = app.state.worldProgress.find((candidate) => candidate.childId === childId && candidate.worldId === world.id);
        return <button key={world.id} className={worldId === world.id ? 'chip chip--active' : 'chip'} type="button" onClick={() => setWorldId(world.id)}>{world.shortName} · niveau {(progress?.stage ?? 0) + 1}</button>;
      })}</div>
      <WorldView app={app} childId={childId} worldId={worldId} />
    </div>
  );
}
