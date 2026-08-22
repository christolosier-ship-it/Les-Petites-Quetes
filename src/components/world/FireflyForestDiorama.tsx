import { lazy, Suspense, useState } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const FireflyForestScene = lazy(() => import('./FireflyForestScene').then((module) => ({ default: module.FireflyForestScene })));

function FireflySceneFallback({ stage }: { readonly stage: 0 | 1 | 2 | 3 }) {
  return (
    <div className={`firefly-forest-three firefly-forest-three--stage-${stage}`} aria-hidden="true">
      <div className="firefly-forest-three__fallback" />
    </div>
  );
}

export function FireflyForestDiorama({ world, stage, reducedMotion, compact = false }: WorldSceneRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const className = compact ? 'parallax-scene parallax-scene--compact' : 'parallax-scene';
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
