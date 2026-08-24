import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';
import { CAMPUS_PROPS, FREE_ACTORS } from './gnomeVillageCampusLayout';
import type { RevealStage } from './gnomeVillageCampusLayout';

const ROOT = '/worlds/gnome-village';
const STRUCTURE = `${ROOT}/structure`;
const CLASSROOM = `${ROOT}/classroom`;
const CAFETERIA = `${ROOT}/cafeteria`;
const ACTORS = `${ROOT}/actors`;
const DEFAULT_PANORAMA_RATIO = 0.48;

type FloorAsset = 'floor-school.png' | 'floor-classroom.png' | 'floor-courtyard.png';
type WallAsset = 'wall-school.png' | 'wall-academic.png';

type Position = Readonly<{ x: number; y: number; z?: number }>;

function sceneStyle(position: Position, width?: number): CSSProperties {
  return { left: position.x, top: position.y, zIndex: position.z, width };
}

function revealClass(reveal?: RevealStage) {
  return reveal ? ` gnome-reveal gnome-reveal--${reveal}` : '';
}

function FloorField({ asset, columns, rows, id, x, y, z = 2 }: {
  readonly asset: FloorAsset;
  readonly columns: number;
  readonly rows: number;
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly z?: number;
}) {
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
  return <div className={`gnome-floor gnome-floor--campus-${id}`} style={{ left: x, top: y, zIndex: z }}>{tiles}</div>;
}

function WallRun({ asset, count, id, x, y, z = 7, vertical = false }: {
  readonly asset: WallAsset;
  readonly count: number;
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly z?: number;
  readonly vertical?: boolean;
}) {
  return (
    <div
      className={`gnome-wall-run gnome-wall-run--campus-${id}${vertical ? ' gnome-wall-run--vertical' : ''}`}
      style={{ left: x, top: y, zIndex: z }}
    >
      {Array.from({ length: count }, (_, index) => <img key={index} src={`${STRUCTURE}/${asset}`} alt="" />)}
    </div>
  );
}

function Actor({ file, id, x, y, z = 22, reveal, motion, nestedClass = '' }: {
  readonly file: string;
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly z?: number;
  readonly reveal?: RevealStage;
  readonly motion?: string;
  readonly nestedClass?: string;
}) {
  const motionClass = motion ? ` gnome-actor--motion-${motion}` : '';
  return (
    <span
      className={`gnome-actor gnome-actor--campus-${id}${motionClass}${nestedClass}${revealClass(reveal)}`}
      style={sceneStyle({ x, y, z })}
    >
      <img src={`${ACTORS}/${file}`} alt="" />
    </span>
  );
}

function Desk({ id, x, y, desk, chair, actor, reveal, books = false, science = false }: {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly desk: string;
  readonly chair: string;
  readonly actor: string;
  readonly reveal?: RevealStage;
  readonly books?: boolean;
  readonly science?: boolean;
}) {
  return (
    <div className={`gnome-desk-cluster gnome-desk-cluster--campus-${id}${revealClass(reveal)}`} style={sceneStyle({ x, y, z: 17 })}>
      <img className="gnome-furni gnome-furni--desk" src={`${CLASSROOM}/${desk}`} alt="" />
      <img className="gnome-furni gnome-furni--chair" src={`${CLASSROOM}/${chair}`} alt="" />
      {books && <img className="gnome-furni gnome-furni--desk-item" src={`${CLASSROOM}/books.png`} alt="" />}
      {science && <img className="gnome-furni gnome-furni--desk-item" src={`${CLASSROOM}/chem-set.png`} alt="" />}
      <span className="gnome-actor gnome-actor--student"><img src={`${ACTORS}/${actor}`} alt="" /></span>
    </div>
  );
}

function CanteenTable({ id, x, y, food, actor, reveal, academic = false }: {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly food: string;
  readonly actor: string;
  readonly reveal?: RevealStage;
  readonly academic?: boolean;
}) {
  const table = academic ? 'academic-table.png' : 'school-table.png';
  const bench = academic ? 'academic-bench.png' : 'school-bench.png';
  return (
    <div className={`gnome-canteen-table gnome-canteen-table--campus-${id}${revealClass(reveal)}`} style={sceneStyle({ x, y, z: 19 })}>
      <img className="gnome-furni gnome-furni--canteen-table" src={`${CAFETERIA}/${table}`} alt="" />
      <img className="gnome-furni gnome-furni--canteen-bench gnome-furni--canteen-bench-back" src={`${CAFETERIA}/${bench}`} alt="" />
      <img className="gnome-furni gnome-furni--canteen-bench gnome-furni--canteen-bench-front" src={`${CAFETERIA}/${bench}`} alt="" />
      <img className="gnome-furni gnome-furni--canteen-food" src={`${CAFETERIA}/${food}`} alt="" />
      <span className="gnome-actor gnome-actor--canteen-seat"><img src={`${ACTORS}/${actor}`} alt="" /></span>
    </div>
  );
}

function syncPanorama(viewport: HTMLDivElement) {
  const maxScroll = Math.max(viewport.scrollWidth - viewport.clientWidth, 1);
  const ratio = Math.min(Math.max(viewport.scrollLeft / maxScroll, 0), 1);
  viewport.style.setProperty('--gnome-scroll-progress', ratio.toFixed(4));
  return ratio;
}

export function GnomeVillageCampus({ world, stage, reducedMotion, compact = false }: WorldSceneRendererProps) {
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

  const scrollPanorama = (direction: -1 | 1) => panoramaRef.current?.scrollBy({
    left: (panoramaRef.current?.clientWidth ?? 0) * 0.72 * direction,
    behavior: reducedMotion ? 'auto' : 'smooth',
  });

  const content = (
    <>
      <div className={`gnome-village gnome-village--stage-${stage}${reducedMotion ? ' gnome-village--reduced-motion' : ''}`}>
        <div
          ref={panoramaRef}
          className={`gnome-panorama${expanded ? ' gnome-panorama--explorable' : ''}`}
          onScroll={() => { if (panoramaRef.current) scrollRatioRef.current = syncPanorama(panoramaRef.current); }}
          data-gnome-panorama="true"
          aria-hidden="true"
        >
          <div className="gnome-panorama__track">
            <section className="gnome-zone gnome-zone--campus">
              <FloorField asset="floor-school.png" columns={18} rows={9} id="main" x={370} y={66} />
              <FloorField asset="floor-classroom.png" columns={7} rows={4} id="library" x={420} y={515} z={3} />
              <FloorField asset="floor-courtyard.png" columns={7} rows={5} id="garden" x={165} y={575} z={4} />

              <WallRun asset="wall-school.png" count={13} id="outer-back-left" x={525} y={64} z={6} />
              <WallRun asset="wall-school.png" count={12} id="outer-back-right" x={1510} y={64} z={6} />
              <WallRun asset="wall-school.png" count={9} id="outer-side-left" x={355} y={190} z={6} vertical />
              <WallRun asset="wall-school.png" count={10} id="outer-side-right" x={2260} y={188} z={6} vertical />
              <WallRun asset="wall-academic.png" count={6} id="room-class" x={585} y={250} />
              <WallRun asset="wall-academic.png" count={5} id="room-lab" x={1120} y={255} />
              <WallRun asset="wall-academic.png" count={5} id="room-office" x={1595} y={260} />
              <WallRun asset="wall-academic.png" count={5} id="corridor-left" x={1055} y={335} z={8} vertical />
              <WallRun asset="wall-academic.png" count={5} id="corridor-right" x={1515} y={345} z={8} vertical />
              <WallRun asset="wall-academic.png" count={7} id="canteen" x={1605} y={510} z={9} />
              <WallRun asset="wall-academic.png" count={5} id="garden" x={385} y={595} z={9} />

              {CAMPUS_PROPS.map((prop) => (
                <img
                  key={prop.id}
                  className={`gnome-prop gnome-prop--campus-${prop.id}${revealClass(prop.reveal)}`}
                  src={`${ROOT}/${prop.folder}/${prop.file}`}
                  alt=""
                  style={sceneStyle(prop, prop.width)}
                />
              ))}

              <div className="gnome-teacher-station gnome-teacher-station--campus" style={sceneStyle({ x: 1170, y: 330, z: 18 })}>
                <img className="gnome-furni gnome-furni--teacher-desk" src={`${CLASSROOM}/teacher-desk.png`} alt="" />
                <img className="gnome-furni gnome-furni--laptop" src={`${CLASSROOM}/laptop.png`} alt="" />
                <span className="gnome-actor gnome-actor--teacher"><img src={`${ACTORS}/teacher.png`} alt="" /></span>
              </div>

              <Desk id="1" x={650} y={340} desk="desk-red.png" chair="chair-red.png" actor="student-write.png" books />
              <Desk id="2" x={760} y={405} desk="desk-green.png" chair="chair-green.png" actor="student-hand.png" reveal={1} />
              <Desk id="3" x={875} y={470} desk="desk-blue.png" chair="chair-blue.png" actor="student-chat.png" reveal={1} science />
              <Desk id="4" x={1005} y={555} desk="desk-red.png" chair="chair-red.png" actor="student-write.png" reveal={2} books />
              <Desk id="5" x={1120} y={620} desk="desk-green.png" chair="chair-green.png" actor="student-chat.png" reveal={2} />
              <Desk id="6" x={1235} y={685} desk="desk-blue.png" chair="chair-blue.png" actor="student-hand.png" reveal={3} books />
              <Desk id="7" x={1365} y={590} desk="desk-red.png" chair="chair-red.png" actor="student-chat.png" reveal={2} />
              <Desk id="8" x={1475} y={655} desk="desk-blue.png" chair="chair-blue.png" actor="student-write.png" reveal={3} books />

              <CanteenTable id="1" x={1585} y={575} food="burger.png" actor="canteen-drink.png" />
              <CanteenTable id="2" x={1740} y={655} food="meatballs.png" actor="student-chat.png" reveal={1} academic />
              <CanteenTable id="3" x={1900} y={720} food="nuggets.png" actor="student-write.png" reveal={2} />
              <CanteenTable id="4" x={2070} y={700} food="vegetables.png" actor="canteen-drink.png" reveal={3} academic />

              {FREE_ACTORS.map((actor) => <Actor key={actor.id} {...actor} />)}

              <span className="gnome-floating-asset gnome-floating-asset--campus-book-one gnome-reveal gnome-reveal--2" style={sceneStyle({ x: 1020, y: 530, z: 24 })}><img src={`${CLASSROOM}/books.png`} alt="" /></span>
              <span className="gnome-floating-asset gnome-floating-asset--campus-book-two gnome-reveal gnome-reveal--3" style={sceneStyle({ x: 1430, y: 560, z: 24 })}><img src={`${CLASSROOM}/books.png`} alt="" /></span>
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

  if (compact) return <div className={sceneClassName} data-world-id={world.id} data-world-stage={stage}>{content}</div>;

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
        if (!expanded && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setExpanded(true); }
        if (event.key === 'Escape') setExpanded(false);
      }}
    >
      {content}
      <button
        type="button"
        className="parallax-scene__expand"
        aria-label={expanded ? 'Quitter le plein écran du Village des Lutins' : 'Mettre le Village des Lutins en grand écran'}
        onClick={(event) => { event.stopPropagation(); setExpanded((value) => !value); }}
      >
        <span aria-hidden="true">{expanded ? '✕' : '⛶'}</span>
        <span>{expanded ? 'Réduire' : 'Grand écran'}</span>
      </button>

      {expanded && (
        <div className="gnome-panorama__controls" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => scrollPanorama(-1)} aria-label="Explorer le village vers la gauche">←</button>
          <div className="gnome-panorama__guide">
            <span>Glisse pour explorer le campus continu des lutins</span>
            <span className="gnome-panorama__progress"><i /></span>
          </div>
          <button type="button" onClick={() => scrollPanorama(1)} aria-label="Explorer le village vers la droite">→</button>
        </div>
      )}

      {!expanded && <div className="parallax-scene__hint">Touchez le tableau pour explorer le village</div>}
    </div>
  );
}
