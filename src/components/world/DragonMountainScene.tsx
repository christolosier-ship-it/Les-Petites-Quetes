import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const ASSET_ROOT = 'https://raw.githubusercontent.com/pixel-boy/NinjaAdventure/main';

const HEROES = [
  `${ASSET_ROOT}/content/character/ninja_blue/sprite.png`,
  `${ASSET_ROOT}/content/character/samurai_blue/sprite.png`,
  `${ASSET_ROOT}/content/character/samurai_green/samurai_green.png`,
] as const;

const WORLD_ITEMS = [
  { id: 'village-hero', src: HEROES[0], x: 28, y: 88, stage: 0, motion: 'walk-a' },
  { id: 'forest-hero', src: HEROES[1], x: 62, y: 72, stage: 1, motion: 'walk-b' },
  { id: 'river-hero', src: HEROES[2], x: 37, y: 58, stage: 1, motion: 'walk-c' },
  { id: 'plain-hero', src: HEROES[0], x: 70, y: 45, stage: 2, motion: 'walk-a' },
  { id: 'snow-hero', src: HEROES[1], x: 32, y: 31, stage: 2, motion: 'walk-b' },
  { id: 'desert-hero', src: HEROES[2], x: 66, y: 20, stage: 3, motion: 'walk-c' },
] as const;

function itemStyle(x: number, y: number): CSSProperties {
  return { left: `${x}%`, top: `${y}%` };
}

function PixelActor({ id, src, x, y, stage, sceneStage, motion }: typeof WORLD_ITEMS[number] & { readonly sceneStage: number }) {
  return (
    <span
      className={`dragon-mountain__actor dragon-mountain__actor--${motion}${sceneStage < stage ? ' dragon-mountain__reveal-hidden' : ''}`}
      data-dragon-scene-item={id}
      style={itemStyle(x, y)}
      aria-hidden="true"
    >
      <span className="dragon-mountain__sprite" style={{ backgroundImage: `url(${src})` }} />
    </span>
  );
}

function syncVerticalProgress(viewport: HTMLDivElement) {
  const maxScroll = Math.max(viewport.scrollHeight - viewport.clientHeight, 1);
  const ratio = Math.min(Math.max(viewport.scrollTop / maxScroll, 0), 1);
  viewport.style.setProperty('--dragon-scroll-progress', ratio.toFixed(4));
  return ratio;
}

export function DragonMountainScene({ world, stage, reducedMotion, compact = false }: WorldSceneRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollRatioRef = useRef(1);
  const positionedRef = useRef(false);
  const className = compact ? 'parallax-scene parallax-scene--compact' : 'parallax-scene';
  const sceneClassName = `${className} dragon-mountain-scene${expanded ? ' parallax-scene--expanded' : ''}`;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const position = () => {
      const maxScroll = Math.max(viewport.scrollHeight - viewport.clientHeight, 0);
      viewport.scrollTop = positionedRef.current ? maxScroll * scrollRatioRef.current : maxScroll;
      scrollRatioRef.current = syncVerticalProgress(viewport);
      positionedRef.current = true;
    };
    const frame = window.requestAnimationFrame(position);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(position);
    observer?.observe(viewport);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [expanded]);

  const scrollScene = (direction: -1 | 1) => viewportRef.current?.scrollBy({
    top: (viewportRef.current?.clientHeight ?? 0) * 0.74 * direction,
    behavior: reducedMotion ? 'auto' : 'smooth',
  });

  const content = (
    <>
      <div className={`dragon-mountain dragon-mountain--stage-${stage}${reducedMotion ? ' dragon-mountain--reduced-motion' : ''}`}>
        <div
          ref={viewportRef}
          className={`dragon-mountain__viewport${expanded ? ' dragon-mountain__viewport--explorable' : ''}`}
          data-dragon-panorama="true"
          onScroll={() => { if (viewportRef.current) scrollRatioRef.current = syncVerticalProgress(viewportRef.current); }}
          aria-hidden="true"
        >
          <div className="dragon-mountain__track">
            <section className="dragon-biome dragon-biome--summit"><span className="dragon-biome__label">Sommet du Dragon</span><div className="dragon-mountain__dragon" data-dragon-scene-item="dragon-boss">🐉</div><div className="dragon-mountain__lava" /></section>
            <section className="dragon-biome dragon-biome--mountain"><span className="dragon-biome__label">Montagne volcanique</span><div className="dragon-mountain__peaks" /></section>
            <section className="dragon-biome dragon-biome--desert"><span className="dragon-biome__label">Désert et canyon</span><div className="dragon-mountain__ruin">▥</div></section>
            <section className="dragon-biome dragon-biome--snow"><span className="dragon-biome__label">Neiges éternelles</span><div className="dragon-mountain__snowfield" /></section>
            <section className="dragon-biome dragon-biome--plain"><span className="dragon-biome__label">Grande plaine</span></section>
            <section className="dragon-biome dragon-biome--river"><span className="dragon-biome__label">Rivière des brumes</span><div className="dragon-mountain__river" /><div className="dragon-mountain__bridge" data-dragon-scene-item="river-bridge" /></section>
            <section className="dragon-biome dragon-biome--forest"><span className="dragon-biome__label">Forêt ancienne</span><div className="dragon-mountain__trees" /></section>
            <section className="dragon-biome dragon-biome--village"><span className="dragon-biome__label">Village du départ</span><div className="dragon-mountain__houses" data-dragon-scene-item="village-houses">⌂ ⌂ ⌂</div></section>
            <div className="dragon-mountain__road" aria-hidden="true" />
            {WORLD_ITEMS.map((item) => <PixelActor key={item.id} {...item} sceneStage={stage} />)}
          </div>
        </div>
      </div>
      <div className="parallax-scene__content dragon-mountain__content"><span className="mascot-bubble">{world.mascotName}</span><h3>{world.name}</h3><p>Du village jusqu’au dragon, une aventure verticale en pixel art 16-bit.</p></div>
    </>
  );

  if (compact) return <div className={sceneClassName} data-world-id={world.id} data-world-stage={stage}>{content}</div>;

  return (
    <div className={sceneClassName} data-world-id={world.id} data-world-stage={stage} onKeyDown={(event) => { if (event.key === 'Escape') setExpanded(false); }}>
      {content}
      <button type="button" className="parallax-scene__expand" onClick={(event) => { event.stopPropagation(); setExpanded((value) => !value); }} aria-label={expanded ? 'Quitter le grand écran de La Montagne du Dragon' : 'Mettre La Montagne du Dragon en grand écran'}>
        <span aria-hidden="true">{expanded ? '✕' : '⛶'}</span><span>{expanded ? 'Réduire' : 'Grand écran'}</span>
      </button>
      {expanded && <div className="dragon-mountain__controls" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => scrollScene(-1)} aria-label="Monter dans la montagne">↑</button><div><span>Glisse verticalement pour remonter jusqu’au dragon</span><span className="dragon-mountain__progress"><i /></span></div><button type="button" onClick={() => scrollScene(1)} aria-label="Redescendre vers le village">↓</button></div>}
      {!expanded && <div className="parallax-scene__hint">Touchez Grand écran pour remonter toute la montagne</div>}
    </div>
  );
}
