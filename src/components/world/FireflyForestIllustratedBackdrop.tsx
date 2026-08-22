import { getAssetUrl } from '../../assets/registry/catalog';

interface FireflyForestIllustratedBackdropProps {
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
}

const DIORAMA_ASSETS = {
  meadow: 'world.firefly-forest.diorama-meadow',
  cottage: 'world.firefly-forest.diorama-cottage',
  rusticHouse: 'world.firefly-forest.diorama-rustic-house',
  treeHouse: 'world.firefly-forest.diorama-tree-house',
  foliage: 'world.firefly-forest.diorama-foliage',
} as const;

export function FireflyForestIllustratedBackdrop({ stage, reducedMotion }: FireflyForestIllustratedBackdropProps) {
  return (
    <div
      className={`firefly-illustrated firefly-illustrated--stage-${stage}${reducedMotion ? ' firefly-illustrated--still' : ''}`}
      aria-hidden="true"
    >
      <div className="firefly-illustrated__sky" />
      <img className="firefly-illustrated__meadow" src={getAssetUrl(DIORAMA_ASSETS.meadow)} alt="" decoding="async" />
      <div className="firefly-illustrated__horizon-haze" />

      {stage >= 1 && (
        <div className="firefly-illustrated__house firefly-illustrated__house--cottage">
          <span className="firefly-illustrated__house-glow" />
          <img src={getAssetUrl(DIORAMA_ASSETS.cottage)} alt="" decoding="async" />
        </div>
      )}

      {stage >= 2 && (
        <div className="firefly-illustrated__house firefly-illustrated__house--rustic">
          <span className="firefly-illustrated__house-glow" />
          <img src={getAssetUrl(DIORAMA_ASSETS.rusticHouse)} alt="" decoding="async" />
        </div>
      )}

      {stage >= 3 && (
        <div className="firefly-illustrated__house firefly-illustrated__house--tree">
          <span className="firefly-illustrated__house-glow" />
          <img src={getAssetUrl(DIORAMA_ASSETS.treeHouse)} alt="" decoding="async" />
        </div>
      )}

      {stage >= 2 && <div className="firefly-illustrated__stream"><span /></div>}

      <img className="firefly-illustrated__foliage firefly-illustrated__foliage--left" src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
      <img className="firefly-illustrated__foliage firefly-illustrated__foliage--right" src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
      <div className="firefly-illustrated__mist firefly-illustrated__mist--far" />
      <div className="firefly-illustrated__mist firefly-illustrated__mist--near" />
      <div className="firefly-illustrated__grade" />
    </div>
  );
}
