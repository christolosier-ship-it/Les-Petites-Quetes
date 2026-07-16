import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { ParallaxScene } from '../../components/world/ParallaxScene';
import { findAvatarDefinition } from '../../content/avatars/avatarCatalog';
import { worldCatalog } from '../../content/world/worldCatalog';
import type { WorldId } from '../../domain/world/WorldDefinition';

interface WorldHubProps {
  readonly app: FamilyAppController;
  readonly childId: string;
  readonly onOpenWorld: (worldId: WorldId) => void;
}

export function WorldHub({ app, childId, onOpenWorld }: WorldHubProps) {
  const child = app.state.children.find((candidate) => candidate.id === childId);
  if (!child) return null;
  const avatar = findAvatarDefinition(child.avatarId);
  const reduceMotion = app.state.settings.reducedMotion === 'reduce';

  return (
    <section className="world-hub" aria-labelledby="world-hub-title">
      <header className="world-hub__header">
        <span className="avatar-token avatar-token--large" aria-hidden="true">{avatar?.presentation === 'girl' ? '👧' : '👦'}</span>
        <div><p className="eyebrow">Bonjour {child.displayName}</p><h2 id="world-hub-title">Choisis ton univers</h2><p>Les pastilles montrent seulement les quêtes prêtes maintenant.</p></div>
      </header>
      <div className="world-tile-grid">
        {worldCatalog.map((world) => {
          const count = app.state.occurrences.filter((occurrence) => occurrence.childId === childId && occurrence.worldId === world.id && occurrence.deletedAt === undefined && occurrence.status === 'available').length;
          const progress = app.state.worldProgress.find((candidate) => candidate.childId === childId && candidate.worldId === world.id);
          return (
            <button key={world.id} type="button" className="world-tile" data-world-tile={world.id} onClick={() => onOpenWorld(world.id)}>
              {count > 0 && <span className="world-notification" aria-label={`${count} quête${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`}>{count}</span>}
              <ParallaxScene world={world} stage={progress?.stage ?? 0} reducedMotion={reduceMotion} compact />
              <span className="world-tile__summary"><strong>{world.name}</strong><small>{world.mascotName} · {world.focus}</small></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
