import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { FireflyForestIllustratedBackdrop } from './FireflyForestIllustratedBackdrop';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const FireflyForestScene = lazy(() => import('./FireflyForestScene').then((module) => ({ default: module.FireflyForestScene })));
const DEFAULT_PANORAMA_RATIO = 0.34;

function FireflySceneFallback() {
  return (
    <div className="firefly-forest-three__actors" aria-hidden="true">
      <div className="firefly-forest-three__fallback" />
    </div>
  );
}

function syncPanoramaVariables(viewport: HTMLDivElement) {
  const maxScroll = Math.max(viewport.scrollWidth - viewport.clientWidth, 1);
  const ratio = Math.min(Math.max(viewport.scrollLeft / maxScroll, 0), 1);
  const scroll = viewport.scrollLeft;

  viewport.style.setProperty('--forest-scroll-progress', ratio.toFixed(4));
  viewport.style.setProperty('--forest-scroll-far', `${scroll * 0.12}px`);
  viewport.style.setProperty('--forest-scroll-mid', `${scroll * 0.06}px`);
  viewport.style.setProperty('--forest-scroll-near', `${scroll * 0.02}px`);

  return ratio;
}

export function FireflyForestDiorama({ world, stage, reducedMotion, compact = false }: WorldSceneRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const scrollRatioRef = useRef(DEFAULT_PANORAMA_RATIO);
  const didPositionRef = useRef(false);
  const className = compact ? 'parallax-scene parallax-scene--compact' : 'parallax-scene';
  const sceneClassName = `${className} parallax-scene--three${expanded ? ' parallax-scene--expanded' : ''}`;

  useEffect(() => {
    const viewport = panoramaRef.current;
    if (!viewport) return;

    const positionPanorama = () => {
      const maxScroll = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
      const ratio = didPositionRef.current ? scrollRatioRef.current : DEFAULT_PANORAMA_RATIO;
      viewport.scrollLeft = maxScroll * ratio;
      scrollRatioRef.current = syncPanoramaVariables(viewport);
      didPositionRef.current = true;
    };

    const frame = window.requestAnimationFrame(positionPanorama);
    const observer = new ResizeObserver(positionPanorama);
    observer.observe(viewport);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [expanded]);

  function handlePanoramaScroll() {
    const viewport = panoramaRef.current;
    if (!viewport) return;
    scrollRatioRef.current = syncPanoramaVariables(viewport);
  }

  function scrollPanorama(direction: -1 | 1) {
    const viewport = panoramaRef.current;
    if (!viewport) return;
    viewport.scrollBy({
      left: viewport.clientWidth * 0.72 * direction,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }

  const content = (
    <>
      <div className={`firefly-forest-three firefly-forest-three--stage-${stage}`}>
        <div
          ref={panoramaRef}
          className={`firefly-panorama${expanded ? ' firefly-panorama--explorable' : ''}`}
          onScroll={handlePanoramaScroll}
          data-firefly-panorama="true"
          aria-hidden="true"
        >
          <div className="firefly-panorama__track">
            <FireflyForestIllustratedBackdrop stage={stage} reducedMotion={reducedMotion} />
          </div>
        </div>
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
      role={expanded ? undefined : 'button'}
      tabIndex={expanded ? -1 : 0}
      aria-label={expanded ? undefined : 'Agrandir le panorama de la Forêt des Lucioles'}
      onClick={() => {
        if (!expanded) setExpanded(true);
      }}
      onKeyDown={(event) => {
        if (!expanded && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          setExpanded(true);
        }
        if (event.key === 'Escape') setExpanded(false);
      }}
    >
      {content}
      <button
        type="button"
        className="parallax-scene__expand"
        aria-label={expanded ? 'Quitter le plein écran du panorama' : 'Mettre le panorama en grand écran'}
        onClick={(event) => {
          event.stopPropagation();
          setExpanded((value) => !value);
        }}
      >
        <span aria-hidden="true">{expanded ? '✕' : '⛶'}</span>
        <span>{expanded ? 'Réduire' : 'Grand écran'}</span>
      </button>

      {expanded && (
        <div className="firefly-panorama__controls" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => scrollPanorama(-1)} aria-label="Explorer la forêt vers la gauche">
            ←
          </button>
          <div className="firefly-panorama__guide">
            <span>Glisse pour explorer la forêt</span>
            <span className="firefly-panorama__progress"><i /></span>
          </div>
          <button type="button" onClick={() => scrollPanorama(1)} aria-label="Explorer la forêt vers la droite">
            →
          </button>
        </div>
      )}

      {!expanded && <div className="parallax-scene__hint">Touchez le tableau pour explorer le panorama</div>}
    </div>
  );
}
