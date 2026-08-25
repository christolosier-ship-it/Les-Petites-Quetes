import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const ASSET_ROOT = '/worlds/dragon-mountain/ninja-adventure/Derived';
const asset = (name: string) => `${ASSET_ROOT}/${name}.webp`;
const MAP_SLICES = Array.from({ length: 8 }, (_, index) => asset(`world-${String(index + 1).padStart(2, '0')}`));

type ActorItem = Readonly<{
  id: string;
  src: string;
  x: number;
  y: number;
  stage: number;
  motion: 'wander-a' | 'wander-b' | 'wander-c' | 'idle' | 'fly';
  size: number;
  z?: number;
}>;

const WORLD_ACTORS: ActorItem[] = [
  { id: 'village-villager', src: asset('villager-walk'), x: 42, y: 96.2, stage: 0, motion: 'wander-a', size: 48 },
  { id: 'village-dog', src: asset('dog-walk'), x: 55, y: 94.8, stage: 0, motion: 'wander-b', size: 42 },
  { id: 'village-chicken', src: asset('chicken-walk'), x: 31, y: 97.1, stage: 0, motion: 'wander-c', size: 36 },
  { id: 'forest-ninja', src: asset('ninja-blue-walk'), x: 60, y: 82.4, stage: 1, motion: 'wander-a', size: 48 },
  { id: 'forest-slime', src: asset('slime-idle'), x: 69, y: 79.4, stage: 1, motion: 'idle', size: 46 },
  { id: 'forest-bat', src: asset('bat-fly'), x: 27, y: 77.1, stage: 1, motion: 'fly', size: 44, z: 16 },
  { id: 'river-samurai', src: asset('samurai-blue-walk'), x: 47, y: 69.7, stage: 1, motion: 'wander-b', size: 48 },
  { id: 'plain-knight', src: asset('knight-walk'), x: 66, y: 56.1, stage: 2, motion: 'wander-c', size: 48 },
  { id: 'plain-lizard', src: asset('lizard-idle'), x: 73, y: 53.9, stage: 2, motion: 'idle', size: 46 },
  { id: 'snow-eskimo', src: asset('eskimo-walk'), x: 35, y: 43.5, stage: 2, motion: 'wander-a', size: 48 },
  { id: 'desert-ninja', src: asset('ninja-fire-walk'), x: 59, y: 31.8, stage: 3, motion: 'wander-b', size: 48 },
  { id: 'mountain-skeleton', src: asset('skeleton-walk'), x: 41, y: 20.7, stage: 3, motion: 'wander-c', size: 48 },
];

const AMBIENT_FX = [
  { id: 'village-flag', src: asset('flag-red'), x: 51.5, y: 91.7, size: 40, stage: 0, className: 'flag' },
  { id: 'forest-plant', src: asset('plant-sway'), x: 36, y: 84.5, size: 40, stage: 1, className: 'plant' },
  { id: 'river-ripple-a', src: asset('water-ripple'), x: 24, y: 68.2, size: 44, stage: 1, className: 'ripple' },
  { id: 'river-ripple-b', src: asset('water-ripple'), x: 77, y: 68.8, size: 38, stage: 1, className: 'ripple' },
  { id: 'snow-particle-a', src: asset('snow-particle'), x: 22, y: 43, size: 36, stage: 2, className: 'snow' },
  { id: 'snow-particle-b', src: asset('snow-particle'), x: 70, y: 40, size: 32, stage: 2, className: 'snow' },
  { id: 'mountain-smoke', src: asset('smoke'), x: 68, y: 18.2, size: 74, stage: 3, className: 'smoke' },
] as const;

const BIOME_LABELS = [
  { label: 'Sommet du Dragon', top: 2.2, side: 'left' },
  { label: 'Montagne volcanique', top: 14.5, side: 'right' },
  { label: 'Désert et canyon', top: 27.0, side: 'left' },
  { label: 'Neiges éternelles', top: 39.5, side: 'right' },
  { label: 'Grande plaine', top: 52.0, side: 'left' },
  { label: 'Rivière des brumes', top: 64.5, side: 'right' },
  { label: 'Forêt ancienne', top: 77.0, side: 'left' },
  { label: 'Village du départ', top: 89.3, side: 'right' },
] as const;

function itemStyle(x: number, y: number, z = 12): CSSProperties {
  return { left: `${x}%`, top: `${y}%`, zIndex: z };
}

function PixelActor({ id, src, x, y, stage, sceneStage, motion, size, z }: ActorItem & { readonly sceneStage: number }) {
  return (
    <span
      className={`dragon-mountain__actor dragon-mountain__actor--${motion}${sceneStage < stage ? ' dragon-mountain__reveal-hidden' : ''}`}
      data-dragon-scene-item={id}
      style={itemStyle(x, y, z)}
      aria-hidden="true"
    >
      <img src={src} alt="" draggable="false" style={{ width: size, height: size }} />
    </span>
  );
}

function AmbientFx({ item, sceneStage }: { readonly item: typeof AMBIENT_FX[number]; readonly sceneStage: number }) {
  return (
    <span
      className={`dragon-mountain__ambient dragon-mountain__ambient--${item.className}${sceneStage < item.stage ? ' dragon-mountain__reveal-hidden' : ''}`}
      data-dragon-scene-item={item.id}
      style={itemStyle(item.x, item.y, 14)}
      aria-hidden="true"
    >
      <img src={item.src} alt="" draggable="false" style={{ width: item.size }} />
    </span>
  );
}

function DragonBoss({ hidden }: { readonly hidden: boolean }) {
  const root = '/worlds/dragon-mountain/ninja-adventure/Actor/Boss/DragonGreen';
  return (
    <div className={`dragon-mountain__dragon${hidden ? ' dragon-mountain__reveal-hidden' : ''}`} data-dragon-scene-item="dragon-boss" aria-hidden="true">
      <img className="dragon-mountain__dragon-wing dragon-mountain__dragon-wing--left" src={`${root}/Wing.webp`} alt="" />
      <img className="dragon-mountain__dragon-wing dragon-mountain__dragon-wing--right" src={`${root}/Wing.webp`} alt="" />
      <img className="dragon-mountain__dragon-body" src={`${root}/Body1.webp`} alt="" />
      <img className="dragon-mountain__dragon-head" src={`${root}/Head.webp`} alt="" />
    </div>
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
    return () => { window.cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [expanded]);

  const scrollScene = (direction: -1 | 1) => viewportRef.current?.scrollBy({
    top: (viewportRef.current?.clientHeight ?? 0) * 0.74 * direction,
    behavior: reducedMotion ? 'auto' : 'smooth',
  });

  const content = (
    <>
      <div className={`dragon-mountain dragon-mountain--stage-${stage}${reducedMotion ? ' dragon-mountain--reduced-motion' : ''}`}>
        <div ref={viewportRef} className={`dragon-mountain__viewport${expanded ? ' dragon-mountain__viewport--explorable' : ''}`} data-dragon-panorama="true" onScroll={() => { if (viewportRef.current) scrollRatioRef.current = syncVerticalProgress(viewportRef.current); }} aria-hidden="true">
          <div className="dragon-mountain__track">
            <div className="dragon-mountain__map" aria-hidden="true">
              {MAP_SLICES.map((src, index) => <img key={src} src={src} alt="" draggable="false" style={{ top: `${index * 12.5}%` }} />)}
            </div>
            {BIOME_LABELS.map((biome) => <span key={biome.label} className={`dragon-biome__label dragon-biome__label--${biome.side}`} style={{ top: `${biome.top}%` }}>{biome.label}</span>)}
            <DragonBoss hidden={stage < 3} />
            {WORLD_ACTORS.map((item) => <PixelActor key={item.id} {...item} sceneStage={stage} />)}
            {AMBIENT_FX.map((item) => <AmbientFx key={item.id} item={item} sceneStage={stage} />)}
            <div className="dragon-mountain__stage-veil" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="parallax-scene__content dragon-mountain__content"><span className="mascot-bubble">{world.mascotName}</span><h3>{world.name}</h3><p>Une route vivante traverse huit biomes jusqu’à l’arène du dragon.</p></div>
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
      {!expanded && <div className="parallax-scene__hint">Grand écran pour parcourir toute la montagne</div>}
    </div>
  );
}
