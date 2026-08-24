import { useEffect, useRef, useState } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const ROOT = '/worlds/gnome-village';
const STRUCTURE = `${ROOT}/structure`;
const CLASSROOM = `${ROOT}/classroom`;
const CAFETERIA = `${ROOT}/cafeteria`;
const COURTYARD = `${ROOT}/courtyard`;
const ACTORS = `${ROOT}/actors`;
const DEFAULT_PANORAMA_RATIO = 0.5;

interface FloorFieldProps {
  readonly asset: 'floor-classroom.png' | 'floor-courtyard.png';
  readonly columns: number;
  readonly rows: number;
  readonly className: string;
}

interface ActorProps {
  readonly file: string;
  readonly className: string;
  readonly bubble?: string;
  readonly reveal?: 1 | 2 | 3;
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

function Actor({ file, className, bubble, reveal }: ActorProps) {
  const revealClass = reveal ? ` gnome-reveal gnome-reveal--${reveal}` : '';
  return (
    <span className={`gnome-actor ${className}${revealClass}`}>
      <span className="gnome-actor__hat" aria-hidden="true" />
      <img src={`${ACTORS}/${file}`} alt="" />
      {bubble && <span className="gnome-actor__bubble">{bubble}</span>}
    </span>
  );
}

function syncPanorama(viewport: HTMLDivElement) {
  const maxScroll = Math.max(viewport.scrollWidth - viewport.clientWidth, 1);
  const ratio = Math.min(Math.max(viewport.scrollLeft / maxScroll, 0), 1);
  const scroll = viewport.scrollLeft;
  viewport.style.setProperty('--gnome-scroll-progress', ratio.toFixed(4));
  viewport.style.setProperty('--gnome-scroll-far', `${scroll * 0.04}px`);
  viewport.style.setProperty('--gnome-scroll-near', `${scroll * 0.015}px`);
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
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(positionPanorama);
    observer?.observe(viewport);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [expanded]);

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
      <div className={`gnome-village gnome-village--stage-${stage}${reducedMotion ? ' gnome-village--reduced-motion' : ''}`}>
        <div
          ref={panoramaRef}
          className={`gnome-panorama${expanded ? ' gnome-panorama--explorable' : ''}`}
          onScroll={() => {
            const viewport = panoramaRef.current;
            if (viewport) scrollRatioRef.current = syncPanorama(viewport);
          }}
          data-gnome-panorama="true"
          aria-hidden="true"
        >
          <div className="gnome-panorama__track">
            <div className="gnome-campus-path" />

            <section className="gnome-zone gnome-zone--courtyard">
              <span className="gnome-zone__label">Cour des lutins</span>
              <FloorField asset="floor-courtyard.png" columns={7} rows={5} className="gnome-floor--courtyard" />

              <img className="gnome-prop gnome-prop--yard-tree" src={`${COURTYARD}/tree.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-bench" src={`${COURTYARD}/bench.png`} alt="" />
              <img className="gnome-prop gnome-prop--park-bench" src={`${COURTYARD}/park-bench.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-fence-one" src={`${COURTYARD}/fence-wood.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-fence-two" src={`${COURTYARD}/fence-wood.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-swing gnome-reveal gnome-reveal--1" src={`${COURTYARD}/swing.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-slide gnome-reveal gnome-reveal--2" src={`${COURTYARD}/slide.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-pond gnome-reveal gnome-reveal--2" src={`${COURTYARD}/garden-pond.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-pot-one gnome-reveal gnome-reveal--1" src={`${COURTYARD}/garden-pot.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-pot-two gnome-reveal gnome-reveal--1" src={`${COURTYARD}/garden-pot.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-frog gnome-reveal gnome-reveal--3" src={`${COURTYARD}/garden-frog.png`} alt="" />
              <img className="gnome-prop gnome-prop--fence-one" src={`${STRUCTURE}/fence-urban.png`} alt="" />
              <img className="gnome-prop gnome-prop--fence-two" src={`${STRUCTURE}/fence-urban.png`} alt="" />
              <div className="gnome-hopscotch gnome-reveal gnome-reveal--1"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i></div>

              <Actor file="courtyard-run.png" className="gnome-actor--yard-run" reveal={1} />
              <Actor file="courtyard-wave.png" className="gnome-actor--yard-wave" bubble="Hé !" reveal={2} />
              <Actor file="student-walk.png" className="gnome-actor--yard-friend" reveal={3} />
            </section>

            <div className="gnome-connector gnome-connector--left">
              <span className="gnome-connector__awning" />
              <img src={`${STRUCTURE}/door-classroom.png`} alt="" />
            </div>

            <section className="gnome-zone gnome-zone--classroom">
              <span className="gnome-zone__label">Grande classe</span>
              <FloorField asset="floor-classroom.png" columns={9} rows={6} className="gnome-floor--classroom" />
              <WallRun count={9} />

              <img className="gnome-prop gnome-prop--class-door" src={`${STRUCTURE}/door-classroom.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-window-one" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-window-two" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-window-three" src={`${STRUCTURE}/window-square.png`} alt="" />

              <img className="gnome-prop gnome-prop--chalkboard" src={`${CLASSROOM}/chalkboard.png`} alt="" />
              <img className="gnome-prop gnome-prop--charts" src={`${CLASSROOM}/charts.png`} alt="" />
              <img className="gnome-prop gnome-prop--bookshelf" src={`${CLASSROOM}/bookshelf.png`} alt="" />
              <img className="gnome-prop gnome-prop--bookcase gnome-reveal gnome-reveal--1" src={`${CLASSROOM}/bookcase.png`} alt="" />
              <img className="gnome-prop gnome-prop--locker gnome-reveal gnome-reveal--1" src={`${CLASSROOM}/locker.png`} alt="" />
              <img className="gnome-prop gnome-prop--projector gnome-reveal gnome-reveal--2" src={`${CLASSROOM}/projector.png`} alt="" />
              <span className="gnome-projector-beam gnome-reveal gnome-reveal--2" />
              <img className="gnome-prop gnome-prop--alarm" src={`${CLASSROOM}/alarm.png`} alt="" />

              <div className="gnome-teacher-station">
                <img className="gnome-furni gnome-furni--teacher-desk" src={`${CLASSROOM}/teacher-desk.png`} alt="" />
                <img className="gnome-furni gnome-furni--laptop" src={`${CLASSROOM}/laptop.png`} alt="" />
                <Actor file="teacher.png" className="gnome-actor--teacher" bubble="À vous !" />
              </div>

              <div className="gnome-desk-cluster gnome-desk-cluster--one">
                <img className="gnome-furni gnome-furni--desk" src={`${CLASSROOM}/desk-green.png`} alt="" />
                <img className="gnome-furni gnome-furni--chair" src={`${CLASSROOM}/chair-green.png`} alt="" />
                <img className="gnome-furni gnome-furni--books" src={`${CLASSROOM}/books.png`} alt="" />
                <Actor file="student-write.png" className="gnome-actor--student-write" />
              </div>

              <div className="gnome-desk-cluster gnome-desk-cluster--two gnome-reveal gnome-reveal--1">
                <img className="gnome-furni gnome-furni--desk" src={`${CLASSROOM}/desk-blue.png`} alt="" />
                <img className="gnome-furni gnome-furni--chair" src={`${CLASSROOM}/chair-blue.png`} alt="" />
                <Actor file="student-hand.png" className="gnome-actor--student-hand" bubble="Moi !" />
              </div>

              <div className="gnome-desk-cluster gnome-desk-cluster--three gnome-reveal gnome-reveal--2">
                <img className="gnome-furni gnome-furni--desk" src={`${CLASSROOM}/desk-green.png`} alt="" />
                <img className="gnome-furni gnome-furni--chair" src={`${CLASSROOM}/chair-green.png`} alt="" />
                <Actor file="student-chat.png" className="gnome-actor--student-chat" bubble="Psst…" />
              </div>

              <div className="gnome-desk-cluster gnome-desk-cluster--four gnome-reveal gnome-reveal--3">
                <img className="gnome-furni gnome-furni--desk" src={`${CLASSROOM}/desk-blue.png`} alt="" />
                <img className="gnome-furni gnome-furni--chair" src={`${CLASSROOM}/chair-blue.png`} alt="" />
                <img className="gnome-furni gnome-furni--books" src={`${CLASSROOM}/books.png`} alt="" />
                <Actor file="student-write.png" className="gnome-actor--student-second" />
              </div>

              <Actor file="student-walk.png" className="gnome-actor--class-walk" reveal={2} />
              <span className="gnome-floating-book gnome-floating-book--one gnome-reveal gnome-reveal--2"><img src={`${CLASSROOM}/books.png`} alt="" /></span>
              <span className="gnome-floating-book gnome-floating-book--two gnome-reveal gnome-reveal--3"><img src={`${CLASSROOM}/books.png`} alt="" /></span>
            </section>

            <div className="gnome-connector gnome-connector--right">
              <span className="gnome-connector__awning" />
              <img src={`${STRUCTURE}/door-classroom.png`} alt="" />
            </div>

            <section className="gnome-zone gnome-zone--cafeteria">
              <span className="gnome-zone__label">Cantine</span>
              <FloorField asset="floor-classroom.png" columns={7} rows={5} className="gnome-floor--cafeteria" />
              <WallRun cabin count={8} />

              <img className="gnome-prop gnome-prop--canteen-window" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-fridge" src={`${CAFETERIA}/fridge.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-counter" src={`${CAFETERIA}/counter.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-cart gnome-reveal gnome-reveal--1" src={`${CAFETERIA}/lunch-cart.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-snacks gnome-reveal gnome-reveal--1" src={`${CAFETERIA}/snacks.png`} alt="" />

              <div className="gnome-canteen-table gnome-canteen-table--one">
                <img className="gnome-furni gnome-furni--canteen-table" src={`${CAFETERIA}/table.png`} alt="" />
                <img className="gnome-furni gnome-furni--canteen-chair gnome-furni--canteen-chair-a" src={`${CAFETERIA}/chair.png`} alt="" />
                <img className="gnome-furni gnome-furni--canteen-chair gnome-furni--canteen-chair-b" src={`${CAFETERIA}/chair.png`} alt="" />
                <img className="gnome-furni gnome-furni--pizza" src={`${CAFETERIA}/pizza.png`} alt="" />
                <span className="gnome-pizza-steam"><i /><i /><i /></span>
                <Actor file="canteen-drink.png" className="gnome-actor--canteen-drink" />
              </div>

              <div className="gnome-canteen-table gnome-canteen-table--two gnome-reveal gnome-reveal--2">
                <img className="gnome-furni gnome-furni--canteen-table" src={`${CAFETERIA}/table.png`} alt="" />
                <img className="gnome-furni gnome-furni--canteen-chair gnome-furni--canteen-chair-a" src={`${CAFETERIA}/chair.png`} alt="" />
                <img className="gnome-furni gnome-furni--canteen-chair gnome-furni--canteen-chair-b" src={`${CAFETERIA}/chair.png`} alt="" />
                <img className="gnome-furni gnome-furni--snack-on-table" src={`${CAFETERIA}/snacks.png`} alt="" />
                <Actor file="student-chat.png" className="gnome-actor--canteen-chat" bubble="Miam !" />
              </div>

              <Actor file="student-walk.png" className="gnome-actor--canteen-walk" reveal={3} />
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
            <span>Glisse entre la cour, la grande classe et la cantine</span>
            <span className="gnome-panorama__progress"><i /></span>
          </div>
          <button type="button" onClick={() => scrollPanorama(1)} aria-label="Explorer le village vers la droite">→</button>
        </div>
      )}

      {!expanded && <div className="parallax-scene__hint">Touchez le tableau pour explorer l’école des lutins</div>}
    </div>
  );
}
