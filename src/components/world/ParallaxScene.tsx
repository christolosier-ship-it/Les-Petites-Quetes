import { useMemo, useState } from 'react';
import { getAssetUrl } from '../../assets/registry/catalog';
import { createSceneDefinition } from '../../content/world/parallaxScenes';
import type { WorldDefinition } from '../../domain/world/WorldDefinition';

interface ParallaxSceneProps {
  readonly world: WorldDefinition;
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
  readonly compact?: boolean;
}

export function ParallaxScene({ world, stage, reducedMotion, compact = false }: ParallaxSceneProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const scene = useMemo(() => createSceneDefinition(world.id, world.stageAssetIds), [world]);

  return (
    <div
      className={compact ? 'parallax-scene parallax-scene--compact' : 'parallax-scene'}
      data-world-id={world.id}
      data-world-stage={stage}
      onPointerMove={(event) => {
        if (reducedMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        setPointer({ x: (event.clientX - bounds.left) / bounds.width - 0.5, y: (event.clientY - bounds.top) / bounds.height - 0.5 });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      {scene.layers.filter((layer) => layer.minimumStage <= stage).map((layer) => {
        const transform = reducedMotion ? undefined : `translate3d(${pointer.x * layer.depth * 24}px, ${pointer.y * layer.depth * 18}px, 0)`;
        if (layer.kind === 'image' && layer.assetId) {
          return <img key={layer.id} className={`parallax-layer parallax-layer--${layer.id}`} src={getAssetUrl(layer.assetId)} alt="" aria-hidden="true" style={{ transform }} />;
        }
        return <div key={layer.id} className={`parallax-layer parallax-layer--${layer.kind}`} aria-hidden="true" style={{ transform }} />;
      })}
      <div className="parallax-scene__content"><span className="mascot-bubble">{world.mascotName}</span><h3>{world.name}</h3><p>{world.focus}</p></div>
    </div>
  );
}
