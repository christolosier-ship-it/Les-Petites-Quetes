import { useEffect, useRef, useState } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const VROOM_GAME_URL = '/games/vroom-scadoodles/index.html';
const VROOM_PREVIEW_URL = '/games/vroom-scadoodles/index.png';

export function VroomScadoodlesGame({ compact = false }: WorldSceneRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!expanded) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => frameRef.current?.contentWindow?.focus(), 80);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  return (
    <section className={`vroom-game${compact ? ' vroom-game--compact' : ''}${expanded ? ' vroom-game--expanded' : ''}`} aria-label="Mini-jeu Le Village des Lutins">
      <div className="vroom-game__viewport">
        {compact ? (
          <>
            <img className="vroom-game__preview" src={VROOM_PREVIEW_URL} alt="" aria-hidden="true" loading="lazy" />
            <div className="vroom-game__compact-cover" aria-hidden="true">
              <span>Course dessinée</span>
              <strong>Le Village des Lutins</strong>
            </div>
          </>
        ) : (
          <iframe
            ref={frameRef}
            className="vroom-game__frame"
            src={VROOM_GAME_URL}
            title="Vroom Scadoodles, le mini-jeu du Village des Lutins"
            loading="eager"
            allow="autoplay; fullscreen; gamepad"
            tabIndex={0}
          />
        )}
      </div>
      {!compact && (
        <button type="button" className="vroom-game__expand" onClick={() => setExpanded((value) => !value)} aria-pressed={expanded}>
          {expanded ? 'Quitter le grand écran' : 'Grand écran'}
        </button>
      )}
    </section>
  );
}
