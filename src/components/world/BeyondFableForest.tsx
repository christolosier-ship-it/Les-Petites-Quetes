import { useEffect, useState } from 'react';
import type { WorldSceneRendererProps } from './WorldSceneProps';
import '../../styles/beyond-fable-frame.css';

function BeyondFablePreview({ name, focus }: { readonly name: string; readonly focus: string }) {
  return (
    <div className="beyond-fable-preview" aria-hidden="true">
      <div className="beyond-fable-preview__moon" />
      <div className="beyond-fable-preview__ridge beyond-fable-preview__ridge--far" />
      <div className="beyond-fable-preview__ridge beyond-fable-preview__ridge--near" />
      <div className="beyond-fable-preview__flies">
        {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
      </div>
      <span className="beyond-fable-preview__label">{name}</span>
      <span className="beyond-fable-preview__focus">{focus}</span>
    </div>
  );
}

export function BeyondFableForest({ world, compact = false }: WorldSceneRendererProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  if (compact) {
    return (
      <div className="parallax-scene beyond-fable-card" data-world-id={world.id}>
        <BeyondFablePreview name={world.name} focus={world.focus} />
      </div>
    );
  }

  return (
    <section
      className={`beyond-fable-scene${expanded ? ' beyond-fable-scene--expanded' : ''}`}
      data-world-id={world.id}
      aria-label={`${world.name}, exploration Beyond Fable`}
    >
      <div className="beyond-fable-scene__viewport">
        <iframe
          className="beyond-fable-scene__frame"
          src="/games/beyond-fable/index.html"
          title={`${world.name} · Beyond Fable`}
          allow="fullscreen"
          loading="eager"
        />
      </div>

      <button
        type="button"
        className="beyond-fable-scene__expand"
        aria-label={expanded ? 'Quitter le grand écran' : 'Mettre Beyond Fable en grand écran'}
        onClick={() => setExpanded((value) => !value)}
      >
        <span aria-hidden="true">{expanded ? '✕' : '⛶'}</span>
        <span>{expanded ? 'Réduire' : 'Grand écran'}</span>
      </button>

      {!expanded && (
        <div className="beyond-fable-scene__caption">
          <strong>Beyond Fable</strong>
          <span>Exploration libre · cycle jour/nuit · météo · interactions</span>
        </div>
      )}
    </section>
  );
}
