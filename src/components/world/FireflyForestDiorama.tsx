import { lazy, Suspense, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { FireflyForestIllustratedBackdrop } from './FireflyForestIllustratedBackdrop';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const FireflyForestScene = lazy(() => import('./FireflyForestScene').then((module) => ({ default: module.FireflyForestScene })));

function FireflySceneFallback() {
  return (
    <div className="firefly-forest-three__actors" aria-hidden="true">
      <div className="firefly-forest-three__fallback" />
    </div>
  );
}

function setIllustratedParallax(container: HTMLDivElement, x: number, y: number) {
  container.style.setProperty('--forest-x-far', `${x * -4}px`);
  container.style.setProperty('--forest-y-far', `${y * -2}px`);
  container.style.setProperty('--forest-x-mid', `${x * -9}px`);
  container.style.setProperty('--forest-y-mid', `${y * -4}px`);
  container.style.setProperty('--forest-x-near', `${x * -16}px`);
  container.style.setProperty('--forest-y-near', `${y * -7}px`);
}

export function FireflyForestDiorama({ world, stage, reducedMotion, compact = false }: WorldSceneRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const dioramaRef = useRef<HTMLDivElement>(null);
  const className = compact ? 'parallax-scene parallax-scene--compact' : 'parallax-scene';
  const sceneClassName = `${className} parallax-scene--three${expanded ? ' parallax-scene--expanded' : ''}`;

  function moveIllustration(event: ReactPointerEvent<HTMLDivElement>) {
    if (reducedMotion || !dioramaRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
    setIllustratedParallax(dioramaRef.current, x, y);
  }

  function resetIllustration() {
    if (dioramaRef.current) setIllustratedParallax(dioramaRef.current, 0, 0);
  }

  const content = (
    <>
      <div
        ref={dioramaRef}
        className={`firefly-forest-three firefly-forest-three--stage-${stage}`}
        onPointerMove={moveIllustration}
        onPointerLeave={resetIllustration}
        aria-hidden="true"
      >
        <FireflyForestIllustratedBackdrop stage={stage} reducedMotion={reducedMotion} />
        <Suspense fallback={<FireflySceneFallback />}>
          <FireflyForestScene stage={stage} reducedMotion={reducedMotion} />
        </Suspense>
      </div>
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
