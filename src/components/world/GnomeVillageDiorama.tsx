import { useEffect, useRef, useState } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const ROOT = '/worlds/gnome-village';
const STRUCTURE = `${ROOT}/structure`;
const CLASSROOM = `${ROOT}/classroom`;
const CAFETERIA = `${ROOT}/cafeteria`;
const COURTYARD = `${ROOT}/courtyard`;
const ACTORS = `${ROOT}/actors`;
const DEFAULT_PANORAMA_RATIO = 0.5;

type FloorAsset = 'floor-school.png' | 'floor-courtyard.png';
type WallAsset = 'wall-school.png' | 'wall-academic.png';

interface FloorFieldProps {
  readonly asset: FloorAsset;
  readonly columns: number;
  readonly rows: number;
  readonly className: string;
}

interface WallRunProps {
  readonly asset: WallAsset;
  readonly count: number;
  readonly className: string;
}

interface ActorProps {
  readonly file: string;
  readonly className: string;
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

function WallRun({ asset, count, className }: WallRunProps) {
  return (
    <div className={`gnome-wall-run ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <img key={index} src={`${STRUCTURE}/${asset}`} alt="" />
      ))}
    </div>
  );
}

function Actor({ file, className, reveal }: ActorProps) {
  const revealClass = reveal ? ` gnome-reveal gnome-reveal--${reveal}` : '';
  return (
    <span className={`gnome-actor ${className}${revealClass}`}>
      <img src={`${ACTORS}/${file}`} alt="" />
    </span>
  );
}

function Desk({
  className,
  desk,
  chair,
  actor,
  reveal,
  books = false,
  science = false,
}: {
  readonly className: string;
  readonly desk: string;
  readonly chair: string;
  readonly actor: string;
  readonly reveal?: 1 | 2 | 3;
  readonly books?: boolean;
  readonly science?: boolean;
}) {
  const revealClass = reveal ? ` gnome-reveal gnome-reveal--${reveal}` : '';
  return (
    <div className={`gnome-desk-cluster ${className}${revealClass}`}>
      <img className="gnome-furni gnome-furni--desk" src={`${CLASSROOM}/${desk}`} alt="" />
      <img className="gnome-furni gnome-furni--chair" src={`${CLASSROOM}/${chair}`} alt="" />
      {books && <img className="gnome-furni gnome-furni--desk-item" src={`${CLASSROOM}/books.png`} alt="" />}
      {science && <img className="gnome-furni gnome-furni--desk-item" src={`${CLASSROOM}/chem-set.png`} alt="" />}
      <Actor file={actor} className="gnome-actor--student" />
    </div>
  );
}

function CanteenTable({
  className,
  food,
  actor,
  reveal,
  academic = false,
}: {
  readonly className: string;
  readonly food: string;
  readonly actor: string;
  readonly reveal?: 1 | 2 | 3;
  readonly academic?: boolean;
}) {
  const revealClass = reveal ? ` gnome-reveal gnome-reveal--${reveal}` : '';
  const table = academic ? 'academic-table.png' : 'school-table.png';
  const bench = academic ? 'academic-bench.png' : 'school-bench.png';
  return (
    <div className={`gnome-canteen-table ${className}${revealClass}`}>
      <img className="gnome-furni gnome-furni--canteen-table" src={`${CAFETERIA}/${table}`} alt="" />
      <img className="gnome-furni gnome-furni--canteen-bench gnome-furni--canteen-bench-back" src={`${CAFETERIA}/${bench}`} alt="" />
      <img className="gnome-furni gnome-furni--canteen-bench gnome-furni--canteen-bench-front" src={`${CAFETERIA}/${bench}`} alt="" />
      <img className="gnome-furni gnome-furni--canteen-food" src={`${CAFETERIA}/${food}`} alt="" />
      <Actor file={actor} className="gnome-actor--canteen-seat" />
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
            <section className="gnome-zone gnome-zone--courtyard">
              <FloorField asset="floor-courtyard.png" columns={8} rows={6} className="gnome-floor--courtyard" />
              <WallRun asset="wall-academic.png" count={7} className="gnome-wall-run--yard" />

              <img className="gnome-prop gnome-prop--yard-door" src={`${STRUCTURE}/door-classroom.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-window-one" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-window-two" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--school-bus" src={`${COURTYARD}/school-bus.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-tree" src={`${COURTYARD}/tree.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-bench" src={`${COURTYARD}/bench.png`} alt="" />
              <img className="gnome-prop gnome-prop--park-bench" src={`${COURTYARD}/park-bench.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-fence-one" src={`${COURTYARD}/fence-wood.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-fence-two" src={`${COURTYARD}/fence-wood.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-swing gnome-reveal gnome-reveal--1" src={`${COURTYARD}/swing.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-slide gnome-reveal gnome-reveal--2" src={`${COURTYARD}/slide.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-play gnome-reveal gnome-reveal--2" src={`${COURTYARD}/play-ramp.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-sports gnome-reveal gnome-reveal--1" src={`${COURTYARD}/sports-equipment.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-bag gnome-reveal gnome-reveal--2" src={`${COURTYARD}/gym-bag.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-pond gnome-reveal gnome-reveal--2" src={`${COURTYARD}/garden-pond.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-pot-one gnome-reveal gnome-reveal--1" src={`${COURTYARD}/garden-pot.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-pot-two gnome-reveal gnome-reveal--1" src={`${COURTYARD}/garden-pot.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-frog gnome-reveal gnome-reveal--3" src={`${COURTYARD}/garden-frog.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-fence-three" src={`${STRUCTURE}/fence-garden.png`} alt="" />
              <img className="gnome-prop gnome-prop--yard-fence-four" src={`${STRUCTURE}/fence-garden.png`} alt="" />

              <Actor file="courtyard-run.png" className="gnome-actor--yard-run" reveal={1} />
              <Actor file="courtyard-wave.png" className="gnome-actor--yard-wave" reveal={2} />
              <Actor file="student-walk.png" className="gnome-actor--yard-friend" reveal={3} />
            </section>

            <section className="gnome-zone gnome-zone--classroom">
              <FloorField asset="floor-school.png" columns={11} rows={7} className="gnome-floor--classroom" />
              <WallRun asset="wall-school.png" count={11} className="gnome-wall-run--class-back" />
              <WallRun asset="wall-school.png" count={6} className="gnome-wall-run--class-side" />

              <img className="gnome-prop gnome-prop--class-door" src={`${STRUCTURE}/door-classroom.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-window-one" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-window-two" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--class-window-three" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--chalkboard" src={`${CLASSROOM}/chalkboard.png`} alt="" />
              <img className="gnome-prop gnome-prop--charts" src={`${CLASSROOM}/charts.png`} alt="" />
              <img className="gnome-prop gnome-prop--bookshelf" src={`${CLASSROOM}/bookshelf.png`} alt="" />
              <img className="gnome-prop gnome-prop--bookcase gnome-reveal gnome-reveal--1" src={`${CLASSROOM}/bookcase.png`} alt="" />
              <img className="gnome-prop gnome-prop--locker-green" src={`${CLASSROOM}/locker.png`} alt="" />
              <img className="gnome-prop gnome-prop--locker-blue gnome-reveal gnome-reveal--1" src={`${CLASSROOM}/locker-blue.png`} alt="" />
              <img className="gnome-prop gnome-prop--locker-red gnome-reveal gnome-reveal--1" src={`${CLASSROOM}/locker-red.png`} alt="" />
              <img className="gnome-prop gnome-prop--coatrack-green" src={`${CLASSROOM}/coatrack-green.png`} alt="" />
              <img className="gnome-prop gnome-prop--coatrack-blue gnome-reveal gnome-reveal--2" src={`${CLASSROOM}/coatrack-blue.png`} alt="" />
              <img className="gnome-prop gnome-prop--coatrack-red gnome-reveal gnome-reveal--3" src={`${CLASSROOM}/coatrack-red.png`} alt="" />
              <img className="gnome-prop gnome-prop--projector gnome-reveal gnome-reveal--2" src={`${CLASSROOM}/projector.png`} alt="" />
              <img className="gnome-prop gnome-prop--alarm" src={`${CLASSROOM}/alarm.png`} alt="" />
              <img className="gnome-prop gnome-prop--science gnome-reveal gnome-reveal--2" src={`${CLASSROOM}/science-equipment.png`} alt="" />

              <div className="gnome-teacher-station">
                <img className="gnome-furni gnome-furni--teacher-desk" src={`${CLASSROOM}/teacher-desk.png`} alt="" />
                <img className="gnome-furni gnome-furni--laptop" src={`${CLASSROOM}/laptop.png`} alt="" />
                <Actor file="teacher.png" className="gnome-actor--teacher" />
              </div>

              <Desk className="gnome-desk-cluster--one" desk="desk-red.png" chair="chair-red.png" actor="student-write.png" books />
              <Desk className="gnome-desk-cluster--two" desk="desk-green.png" chair="chair-green.png" actor="student-hand.png" reveal={1} />
              <Desk className="gnome-desk-cluster--three" desk="desk-blue.png" chair="chair-blue.png" actor="student-chat.png" reveal={1} science />
              <Desk className="gnome-desk-cluster--four" desk="desk-red.png" chair="chair-red.png" actor="student-write.png" reveal={2} books />
              <Desk className="gnome-desk-cluster--five" desk="desk-green.png" chair="chair-green.png" actor="student-chat.png" reveal={2} />
              <Desk className="gnome-desk-cluster--six" desk="desk-blue.png" chair="chair-blue.png" actor="student-hand.png" reveal={3} books />

              <Actor file="student-walk.png" className="gnome-actor--class-walk" reveal={2} />
              <span className="gnome-floating-asset gnome-floating-asset--book-one gnome-reveal gnome-reveal--2"><img src={`${CLASSROOM}/books.png`} alt="" /></span>
              <span className="gnome-floating-asset gnome-floating-asset--book-two gnome-reveal gnome-reveal--3"><img src={`${CLASSROOM}/books.png`} alt="" /></span>
            </section>

            <section className="gnome-zone gnome-zone--cafeteria">
              <FloorField asset="floor-school.png" columns={8} rows={6} className="gnome-floor--cafeteria" />
              <WallRun asset="wall-academic.png" count={8} className="gnome-wall-run--canteen-back" />
              <WallRun asset="wall-academic.png" count={5} className="gnome-wall-run--canteen-side" />

              <img className="gnome-prop gnome-prop--canteen-door" src={`${STRUCTURE}/door-classroom.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-window-one" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-window-two" src={`${STRUCTURE}/window-square.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-fridge" src={`${CAFETERIA}/fridge.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-counter" src={`${CAFETERIA}/counter.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-cart gnome-reveal gnome-reveal--1" src={`${CAFETERIA}/lunch-cart.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-tray gnome-reveal gnome-reveal--1" src={`${CAFETERIA}/red-tray.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-vegetables gnome-reveal gnome-reveal--2" src={`${CAFETERIA}/vegetables.png`} alt="" />
              <img className="gnome-prop gnome-prop--canteen-pizza gnome-reveal gnome-reveal--3" src={`${CAFETERIA}/pizza.png`} alt="" />

              <CanteenTable className="gnome-canteen-table--one" food="burger.png" actor="canteen-drink.png" />
              <CanteenTable className="gnome-canteen-table--two" food="meatballs.png" actor="student-chat.png" reveal={1} academic />
              <CanteenTable className="gnome-canteen-table--three" food="nuggets.png" actor="student-write.png" reveal={2} />
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

      {!expanded && <div className="parallax-scene__hint">Touchez le tableau pour explorer l’école</div>}
    </div>
  );
}
