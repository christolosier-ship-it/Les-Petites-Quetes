import { useEffect, useRef, useState } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const ORIGIN_GAME_URL = '/games/origin/index.html';

export function DragonMountainGame({ compact = false }: WorldSceneRendererProps) {
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
    <section className={`dragon-game${compact ? ' dragon-game--compact' : ''}${expanded ? ' dragon-game--expanded' : ''}`} aria-label="Mini-jeu La Montagne du Dragon">
      <div className="dragon-game__viewport">
        <iframe
          ref={frameRef}
          className="dragon-game__frame"
          src={ORIGIN_GAME_URL}
          title="Origin, le mini RPG de La Montagne du Dragon"
          loading={compact ? 'lazy' : 'eager'}
          allow="autoplay; fullscreen"
          tabIndex={compact ? -1 : 0}
        />
        {compact && (
          <div className="dragon-game__compact-cover" aria-hidden="true">
            <span>RPG 16-bit</span>
            <strong>La Montagne du Dragon</strong>
          </div>
        )}
      </div>
      {!compact && (
        <button type="button" className="dragon-game__expand" onClick={() => setExpanded((value) => !value)} aria-pressed={expanded}>
          {expanded ? 'Quitter le grand écran' : 'Grand écran'}
        </button>
      )}
    </section>
  );
}
