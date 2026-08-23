import { getAssetUrl } from '../../assets/registry/catalog';

interface FireflyForestIllustratedBackdropProps {
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
}

const ASSETS = {
  meadow: 'world.firefly-forest.diorama-meadow',
  cottage: 'world.firefly-forest.diorama-cottage',
  rusticHouse: 'world.firefly-forest.diorama-rustic-house',
  treeHouse: 'world.firefly-forest.diorama-tree-house',
  foliage: 'world.firefly-forest.diorama-foliage',
  oak: 'world.firefly-forest.tree-oak',
  pine: 'world.firefly-forest.tree-pine',
  birch: 'world.firefly-forest.tree-birch',
  willow: 'world.firefly-forest.tree-willow',
  maple: 'world.firefly-forest.tree-maple',
  river: 'world.firefly-forest.river-bank',
  bridge: 'world.firefly-forest.bridge-wood',
} as const;

type TreeKind = 'oak' | 'pine' | 'birch' | 'willow' | 'maple';

function DistantHouse({ variant }: { readonly variant: 'cottage' | 'rustic' }) {
  const asset = variant === 'cottage' ? ASSETS.cottage : ASSETS.rusticHouse;
  return (
    <span className={`firefly-panorama-house firefly-panorama-house--${variant}`}>
      <i />
      <img src={getAssetUrl(asset)} alt="" decoding="async" />
    </span>
  );
}

function Tree({ kind, name, depth }: { readonly kind: TreeKind; readonly name: string; readonly depth: 'far' | 'middle' | 'near' | 'foreground' }) {
  return (
    <img
      className={`firefly-scenery-tree firefly-scenery-tree--${depth} firefly-scenery-tree--${name}`}
      src={getAssetUrl(ASSETS[kind])}
      alt=""
      decoding="async"
    />
  );
}

export function FireflyForestIllustratedBackdrop({ stage, reducedMotion }: FireflyForestIllustratedBackdropProps) {
  return (
    <div className={`firefly-illustrated firefly-illustrated--stage-${stage}${reducedMotion ? ' firefly-illustrated--still' : ''}`} aria-hidden="true">
      <div className="firefly-panorama-layer firefly-panorama-layer--sky">
        <div className="firefly-panorama-sky" />
        <div className="firefly-panorama-aurora firefly-panorama-aurora--violet" />
        <div className="firefly-panorama-aurora firefly-panorama-aurora--mint" />
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--far">
        <div className="firefly-panorama-ridge firefly-panorama-ridge--one" />
        <div className="firefly-panorama-ridge firefly-panorama-ridge--two" />
        <div className="firefly-panorama-ridge firefly-panorama-ridge--three" />
        <div className="firefly-panorama-ridge firefly-panorama-ridge--four" />
        <Tree kind="pine" name="far-a" depth="far" />
        <Tree kind="birch" name="far-b" depth="far" />
        <Tree kind="oak" name="far-c" depth="far" />
        <Tree kind="pine" name="far-d" depth="far" />
        <Tree kind="maple" name="far-e" depth="far" />
        <Tree kind="pine" name="far-f" depth="far" />
        <Tree kind="birch" name="far-g" depth="far" />
        <Tree kind="oak" name="far-h" depth="far" />
        {stage >= 3 && (
          <>
            <div className="firefly-panorama-village firefly-panorama-village--west">
              <DistantHouse variant="rustic" /><DistantHouse variant="cottage" /><DistantHouse variant="rustic" />
            </div>
            <div className="firefly-panorama-village firefly-panorama-village--east">
              <DistantHouse variant="cottage" /><DistantHouse variant="rustic" /><DistantHouse variant="cottage" />
            </div>
          </>
        )}
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--middle">
        <div className="firefly-panorama-forestline firefly-panorama-forestline--west">
          <img src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
          <img src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
          <img src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
        </div>
        <div className="firefly-panorama-forestline firefly-panorama-forestline--east">
          <img src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
          <img src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
          <img src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
        </div>
        <Tree kind="oak" name="west-a" depth="middle" />
        <Tree kind="birch" name="west-b" depth="middle" />
        <Tree kind="pine" name="west-c" depth="middle" />
        <Tree kind="maple" name="west-d" depth="middle" />
        <Tree kind="pine" name="center-a" depth="middle" />
        <Tree kind="birch" name="center-b" depth="middle" />
        <Tree kind="willow" name="east-a" depth="middle" />
        <Tree kind="oak" name="east-b" depth="middle" />
        <Tree kind="pine" name="east-c" depth="middle" />
        <Tree kind="maple" name="east-d" depth="middle" />
        <div className="firefly-panorama-ground firefly-panorama-ground--west" />
        <div className="firefly-panorama-ground firefly-panorama-ground--center" />
        <div className="firefly-panorama-ground firefly-panorama-ground--east" />
        <img className="firefly-panorama-meadow" src={getAssetUrl(ASSETS.meadow)} alt="" decoding="async" />
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--near">
        <Tree kind="oak" name="near-west-a" depth="near" />
        <Tree kind="birch" name="near-west-b" depth="near" />
        <Tree kind="willow" name="near-east-a" depth="near" />
        <Tree kind="pine" name="near-east-b" depth="near" />
        <Tree kind="maple" name="near-east-c" depth="near" />
        {stage >= 1 && (
          <div className="firefly-panorama-landmark firefly-panorama-landmark--cottage">
            <span className="firefly-panorama-landmark__ground" /><span className="firefly-panorama-landmark__glow" />
            <img src={getAssetUrl(ASSETS.cottage)} alt="" decoding="async" />
            <div className="firefly-panorama-flowerpatch firefly-panorama-flowerpatch--cottage" />
          </div>
        )}
        {stage >= 2 && (
          <>
            <div className="firefly-panorama-landmark firefly-panorama-landmark--rustic">
              <span className="firefly-panorama-landmark__ground" /><span className="firefly-panorama-landmark__glow" />
              <img src={getAssetUrl(ASSETS.rusticHouse)} alt="" decoding="async" />
            </div>
            <img className="firefly-panorama-river-asset" src={getAssetUrl(ASSETS.river)} alt="" decoding="async" />
            <div className="firefly-panorama-flowerpatch firefly-panorama-flowerpatch--glade" />
          </>
        )}
        {stage >= 3 && (
          <>
            <div className="firefly-panorama-landmark firefly-panorama-landmark--treehouse">
              <span className="firefly-panorama-landmark__ground" /><span className="firefly-panorama-landmark__glow" />
              <img src={getAssetUrl(ASSETS.treeHouse)} alt="" decoding="async" />
            </div>
            <img className="firefly-panorama-bridge-asset" src={getAssetUrl(ASSETS.bridge)} alt="" decoding="async" />
            <div className="firefly-panorama-flowerpatch firefly-panorama-flowerpatch--village" />
            <div className="firefly-panorama-lanterns" />
          </>
        )}
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--foreground">
        <img className="firefly-panorama-foliage firefly-panorama-foliage--a" src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--b" src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--c" src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--d" src={getAssetUrl(ASSETS.foliage)} alt="" decoding="async" />
        <Tree kind="willow" name="foreground-west" depth="foreground" />
        <Tree kind="oak" name="foreground-east" depth="foreground" />
      </div>
      <div className="firefly-panorama-color-grade" />
    </div>
  );
}
