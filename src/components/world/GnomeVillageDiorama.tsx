import { useEffect, useRef, useState } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const STRUCTURE = '/worlds/gnome-village/structure';
const DEFAULT_PANORAMA_RATIO = 0.5;

interface FloorFieldProps {
  readonly asset: 'floor-classroom.png' | 'floor-courtyard.png';
  readonly columns: number;
  readonly rows: number;
  readonly className: string;
}

function FloorField({ asset, columns, rows, className }: FloorFieldProps) {
  const tileWidth = asset === 'floor-courtyard.png' ? 128 : 132;
  const tileHeight = asset === 'floor-courtyard.png' ? 66 : 67;
  const tiles = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const left = (column - row) * (tileWidth / 2) + rows * (tileWidth / 2);
      const top = (column + row) * (tileHeight / 2);
      tiles.push(<img key={`${row}-${column}`} src={`${STRUCTURE}/${asset}`} alt="" style={{ left, top }} />);
    }
  }
  return <div className={`gnome-floor ${className}`}>{tiles}</div>;
}

function WallRun({ cabin = false, count = 5 }: { readonly cabin?: boolean; readonly count?: number }) {
  const asset = cabin ? 'wall-cabin.png' : 'wall-classroom.png';
  return (
    <div className={`gnome-wall-run${cabin ? ' gnome-wall-run--cabin' : ''}`}>
      {Array.from({ length: count }, (_, index) => <img key={index} src={`${STRUCTURE}/${asset}`} alt="" />)}
    </div>
  );
}

function syncPanorama(viewport: HTMLDivElement) {
  const maxScroll = Math.max(viewport.scrollWidth - viewport.clientWidth, 1);
  const ratio = Math.min(Math.max(viewport.scrollLeft / maxScroll, 0), 1);
  viewport.style.setProperty('--gnome-scroll-progress', ratio.toFixed(4));
  return ratio;
}

export function GnomeVillageDiorama({ world, stage, reducedMotion, compact = false }: WorldSceneRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const scrollRatioRef = useRef(DEFAULT_PANORAMA_RATIO);
  const didPositionRef = useRef(false);
  const className = compact ? 'parallax-scene parallax-scene--compact' : 'parallax-scene';
  const sceneClassName = `${className} parallax-scene--three gnome-village-scene${expanded ? ' parallax-scene--expanded' : ''}`;

  useEffect(() => {
    const viewport = panoramaRef.current;
    if (!viewport) return;
    const positionPanorama = () => {
      const maxScroll = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
      const ratio = didPositionRef.current ? scrollRatioRef.current : DEFAULT_PANORAMA_RATIO;
      viewport.scrollLeft = maxScroll * ratio;
      scrollRatioRef.current = syncPanorama(viewport);
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

  function scrollPanorama(direction: -1 | 1) {
    const viewport = panoramaRef.current;
    if (!viewport) return;
    viewport.scrollBy({ left: viewport.clientWidth * 0.72 * direction, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  const content = (
    <>
      <div className={`gnome-village gnome-village--stage-${stage}${reducedMotion ? ' gnome-village--reduced-motion' : ''}`}>
        <div
          ref={panoramaRef}
          className={`gnome-panorama${expanded ? ' gnome-panorama--explorable' : ''}`}
          onScroll={() => {
            const viewport = panoramaRef.current;
            if (viewport) scrollRatioRef.current = syncPanorama(viewport);
          }}
          aria-hidden="true"
        >
          <div className="gnome-panorama__track">
            <section className="gnome-zone gnome-zone--courtyard">
              <span className="gnome-zone__label">Cour de récréation</span>
              <FloorField asset="floor-courtyard.png" columns={5} rows={4} className="gnome-floor--courtyard" />
              <img className="gnome-prop gnome-prop--fence-one" src={`${STRUCTURE}/fence-urban.png`} alt="" />
              <img className="gnome-prop gnome-prop--fence-two" src={`${STRUCTURE}/fence-urban.png`} alt="" />
              <img className="gnome-prop gnome-prop--fence-garden" src={`${STRUCTURE}/fence-garden.png`} alt="" />
              <img className="gnome-prop gnome-prop--street-corner" src={`${STRUCTURE}/corner-street.png`} alt="" />
              <img className="gnome-prop gnome-prop--rail-corner" src={`${STRUCTURE}/corner-railing.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-bench" src={`${STRUCTURE}/bench-cafeteria.png`} alt="" />
            </section>

            <section className="gnome-zone gnome-zone--classroom">
              <span className="gnome-zone__label">Salle de classe</span>
              <FloorField asset="floor-classroom.png" columns={6} rows={5} className="gnome-floor--classroom" />
              <WallRun count={6} />
              <img className="gnome-prop gnome-prop--class-door" src={`${STRUCTURE}/door-classroom.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-window-one" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-window-two" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-bench" src={`${STRUCTURE}/bench-cafeteria.png`} alt="" />
            </section>

            <section className="gnome-zone gnome-zone--cafeteria">
              <span className="gnome-zone__label">Cantine</span>
              <FloorField asset="floor-classroom.png" columns={5} rows={4} className="gnome-floor--cafeteria" />
              <WallRun cabin count={6} />
              <img className="gnome-prop gnome-prop--canteen-window" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-bench-one" src={`${STRUCTURE}/bench-cafeteria.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-bench-two" src={`${STRUCTURE}/bench-cafeteria.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-corner" src={`${STRUCTURE}/corner-street.png`} alt="" />
            </section>
          </div>
        </div>
      </div>
      <div className="parallax-scene__content gnome-village__content">
        <span className="mascot-bubble">{world.mascotName}</span>
        <h3>{world.name}</h3>
        <p>{world.focus}</p>
      </div>
    </>
  );

  if (compact) {
    return <div className={sceneClassName} data-world-id={world.id} data-world-stage={stage}>{content}</div>;
  }

  return (
    <div
      className={sceneClassName}
      data-world-id={world.id}
      data-world-stage={stage}
      role={expanded ? undefined : 'button'}
      tabIndex={expanded ? -1 : 0}
      aria-label={expanded ? undefined : 'Agrandir le panorama du Village des Lutins'}
      onClick={() => { if (!expanded) setExpanded(true); }}
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
        aria-label={expanded ? 'Quitter le plein écran du Village des Lutins' : 'Mettre le Village des Lutins en grand écran'}
        onClick={(event) => {
          event.stopPropagation();
          setExpanded((value) => !value);
        }}
      >
        <span aria-hidden="true">{expanded ? '✕' : '⛶'}</span>
        <span>{expanded ? 'Réduire' : 'Grand écran'}</span>
      </button>

      {expanded && (
        <div className="gnome-panorama__controls" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => scrollPanorama(-1)} aria-label="Explorer le village vers la gauche">←</button>
          <div className="gnome-panorama__guide">
            <span>Glisse entre la cour, la classe et la cantine</span>
            <span className="gnome-panorama__progress"><i /></span>
          </div>
          <button type="button" onClick={() => scrollPanorama(1)} aria-label="Explorer le village vers la droite">→</button>
        </div>
      )}

      {!expanded && <div className="parallax-scene__hint">Touchez le tableau pour explorer l’école des lutins</div>}
    </div>
  );
}
