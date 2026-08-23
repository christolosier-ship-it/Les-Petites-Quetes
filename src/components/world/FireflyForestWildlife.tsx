import { getAssetUrl } from '../../assets/registry/catalog';

interface FireflyForestWildlifeProps {
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
}

const WILDLIFE_ASSETS = {
  fox: 'world.firefly-forest.wildlife-fox',
  owl: 'world.firefly-forest.wildlife-owl',
  badger: 'world.firefly-forest.wildlife-badger',
  rabbit: 'world.firefly-forest.wildlife-rabbit',
  deer: 'world.firefly-forest.wildlife-deer',
  bat: 'world.firefly-forest.wildlife-bat',
  hedgehog: 'world.firefly-forest.wildlife-hedgehog',
  girl: 'world.firefly-forest.girl-pajamas',
} as const;

function Sprite({ asset, className }: { readonly asset: keyof typeof WILDLIFE_ASSETS; readonly className: string }) {
  return <img className={className} src={getAssetUrl(WILDLIFE_ASSETS[asset])} alt="" decoding="async" />;
}

export function FireflyForestWildlife({ stage, reducedMotion }: FireflyForestWildlifeProps) {
  return (
    <div
      className={`firefly-wildlife${reducedMotion ? ' firefly-wildlife--still' : ''}`}
      data-firefly-wildlife="true"
      aria-hidden="true"
    >
      {stage >= 1 && (
        <>
          <Sprite asset="girl" className="firefly-wildlife__girl" />
          <Sprite asset="hedgehog" className="firefly-wildlife__animal firefly-wildlife__hedgehog" />
        </>
      )}

      {stage >= 2 && (
        <>
          <Sprite asset="fox" className="firefly-wildlife__animal firefly-wildlife__fox" />
          <Sprite asset="owl" className="firefly-wildlife__animal firefly-wildlife__owl" />
          <Sprite asset="rabbit" className="firefly-wildlife__animal firefly-wildlife__rabbit" />
        </>
      )}

      {stage >= 3 && (
        <>
          <Sprite asset="badger" className="firefly-wildlife__animal firefly-wildlife__badger" />
          <Sprite asset="deer" className="firefly-wildlife__animal firefly-wildlife__deer" />
          <div className="firefly-wildlife__bats">
            <Sprite asset="bat" className="firefly-wildlife__bat firefly-wildlife__bat--one" />
            <Sprite asset="bat" className="firefly-wildlife__bat firefly-wildlife__bat--two" />
            <Sprite asset="bat" className="firefly-wildlife__bat firefly-wildlife__bat--three" />
          </div>
        </>
      )}
    </div>
  );
}
