import { lazy, Suspense, useMemo, useState } from 'react';
import { getAssetUrl } from '../../assets/registry/catalog';
import { createSceneDefinition } from '../../content/world/parallaxScenes';
import type { WorldDefinition } from '../../domain/world/WorldDefinition';

const FireflyForestScene = lazy(() => import('./FireflyForestScene').then((module) => ({ default: module.FireflyForestScene })));

interface ParallaxSceneProps {
  readonly world: WorldDefinition;
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
  readonly compact?: boolean;
}

function FireflySceneFallback({ stage }: { readonly stage: 0 | 1 | 2 | 3 }) {
  return <div className={`firefly-forest-three firefly-forest-three--stage-${stage}`} aria-hidden="true"><div className="firefly-forest-three__fallback" /></div>;
}

export function ParallaxScene({ world, stage, reducedMotion, compact = false }: ParallaxSceneProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const scene = useMemo(() => createSceneDefinition(world.id, world.stageAssetIds), [world]);
  const className = compact ? 'parallax-scene parallax-scene--compact' : 'parallax-scene';

  if (world.id === 'world.firefly-forest') {
    const sceneClassName = `${className} parallax-scene--three${expanded ? ' parallax-scene--expanded' : ''}`;
    const content = (
      <>
        <Suspense fallback={<FireflySceneFallback stage={stage} />}>
          <FireflyForestScene stage={stage} reducedMotion={reducedMotion} />
        </Suspense>
        <div className="parallax-scene__content">
          <span className="mascot-bubble">{world.mascotName}</span>
          <h3>{world.name}</h3>
          <p>{world.focus}</p>
        </div>
      </>
    );

    if (compact) {
      return (
        <div className={sceneClassName} data-world-id={world.id} data-world-stage={stage}>
          {content}
        </div>
      );
    }

    return (
      <div
        className={sceneClassName}
        data-world-id={world.id}
        data-world-stage={stage}
        role="button"
        tabIndex={0}
        aria-label={expanded ? 'Réduire le tableau de la Forêt des Lucioles' : 'Agrandir le tableau de la Forêt des Lucioles'}
        onClick={() => setExpanded((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setExpanded((value) => !value);
          }
          if (event.key === 'Escape') setExpanded(false);
        }}
      >
        {content}
        <button
          type="button"
          className="parallax-scene__expand"
          aria-label={expanded ? 'Quitter le plein écran du tableau' : 'Mettre le tableau en grand écran'}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((value) => !value);
          }}
        >
          <span aria-hidden="true">{expanded ? '✕' : '⛶'}</span>
          <span>{expanded ? 'Réduire' : 'Grand écran'}</span>
        </button>
        {!expanded && <div className="parallax-scene__hint">Touchez le tableau pour entrer dans la forêt</div>}
      </div>
    );
  }

  return (
    <div
      className={className}
      data-world-id={world.id}
      data-world-stage={stage}
      onPointerMove={(event) => {
        if (reducedMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        setPointer({ x: (event.clientX - bounds.left) / bounds.width - 0.5, y: (event.clientY - bounds.top) / bounds.height - 0.5 });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      {scene.layers.filter((layer) => layer.minimumStage <= stage).map((layer) => {
        const transform = reducedMotion ? undefined : `translate3d(${pointer.x * layer.depth * 24}px, ${pointer.y * layer.depth * 18}px, 0)`;
        if (layer.kind === 'image' && layer.assetId) {
          return <img key={layer.id} className={`parallax-layer parallax-layer--${layer.id}`} src={getAssetUrl(layer.assetId)} alt="" aria-hidden="true" style={{ transform }} />;
        }
        return <div key={layer.id} className={`parallax-layer parallax-layer--${layer.kind}`} aria-hidden="true" style={{ transform }} />;
      })}
      <div className="parallax-scene__content"><span className="mascot-bubble">{world.mascotName}</span><h3>{world.name}</h3><p>{world.focus}</p></div>
    </div>
  );
}
