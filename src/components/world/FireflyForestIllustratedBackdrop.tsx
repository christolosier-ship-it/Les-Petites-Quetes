import { FIREFLY_ILLUSTRATION_ASSETS as ASSETS, getFireflyAssetUrl } from '../../assets/registry/fireflyCatalog';

interface FireflyForestIllustratedBackdropProps {
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
}

type AssetName = keyof typeof ASSETS;
type TreeKind = 'deciduous1' | 'deciduous2' | 'deciduous3' | 'coniferous1' | 'coniferous3';

function Scenery({ asset, className, eager = false }: { readonly asset: AssetName; readonly className: string; readonly eager?: boolean }) {
  return <img className={className} src={getFireflyAssetUrl(ASSETS[asset])} alt="" decoding="async" loading={eager ? 'eager' : 'lazy'} />;
}

function DistantHouse({ variant }: { readonly variant: 'cottage' | 'rustic' }) {
  const asset = variant === 'cottage' ? ASSETS.cottage : ASSETS.rusticHouse;
  return (
    <span className={`firefly-panorama-house firefly-panorama-house--${variant}`}>
      <i />
      <img src={getFireflyAssetUrl(asset)} alt="" decoding="async" loading="lazy" />
    </span>
  );
}

function Tree({ kind, name, depth }: { readonly kind: TreeKind; readonly name: string; readonly depth: 'far' | 'middle' | 'near' | 'foreground' }) {
  return <Scenery asset={kind} className={`firefly-scenery-tree firefly-scenery-tree--${depth} firefly-scenery-tree--${name}`} />;
}

export function FireflyForestIllustratedBackdrop({ stage, reducedMotion }: FireflyForestIllustratedBackdropProps) {
  return (
    <div className={`firefly-illustrated firefly-illustrated--stage-${stage}${reducedMotion ? ' firefly-illustrated--still' : ''}`} aria-hidden="true">
      <div className="firefly-panorama-layer firefly-panorama-layer--sky">
        <div className="firefly-panorama-sky" />
        <div className="firefly-panorama-aurora firefly-panorama-aurora--violet" />
        <div className="firefly-panorama-aurora firefly-panorama-aurora--mint" />
        <div className="firefly-panorama-mist firefly-panorama-mist--west" />
        <div className="firefly-panorama-mist firefly-panorama-mist--east" />
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--far">
        <Scenery asset="reliefPeakA" className="firefly-scenery-relief firefly-scenery-relief--west" />
        <Scenery asset="reliefPeakB" className="firefly-scenery-relief firefly-scenery-relief--center" eager />
        <Scenery asset="reliefCliff" className="firefly-scenery-relief firefly-scenery-relief--east" />
        <Scenery asset="distantPines" className="firefly-distant-pines firefly-distant-pines--west" />
        <Scenery asset="distantPines" className="firefly-distant-pines firefly-distant-pines--center" />
        <Scenery asset="distantPines" className="firefly-distant-pines firefly-distant-pines--east" />
        <Tree kind="coniferous1" name="far-a" depth="far" />
        <Tree kind="deciduous3" name="far-b" depth="far" />
        <Tree kind="deciduous1" name="far-c" depth="far" />
        <Tree kind="coniferous3" name="far-d" depth="far" />
        <Tree kind="deciduous2" name="far-e" depth="far" />
        <Tree kind="coniferous1" name="far-f" depth="far" />
        <Tree kind="deciduous3" name="far-g" depth="far" />
        <Tree kind="deciduous1" name="far-h" depth="far" />
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
          <img src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
          <img src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
          <img src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
        </div>
        <div className="firefly-panorama-forestline firefly-panorama-forestline--east">
          <img src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
          <img src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
          <img src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
        </div>
        <Tree kind="deciduous1" name="west-a" depth="middle" />
        <Tree kind="deciduous3" name="west-b" depth="middle" />
        <Tree kind="coniferous1" name="west-c" depth="middle" />
        <Tree kind="deciduous2" name="west-d" depth="middle" />
        <Tree kind="coniferous3" name="center-a" depth="middle" />
        <Tree kind="deciduous3" name="center-b" depth="middle" />
        <Tree kind="deciduous2" name="east-a" depth="middle" />
        <Tree kind="deciduous1" name="east-b" depth="middle" />
        <Tree kind="coniferous1" name="east-c" depth="middle" />
        <Tree kind="deciduous3" name="east-d" depth="middle" />
        <div className="firefly-panorama-ground firefly-panorama-ground--west" />
        <div className="firefly-panorama-ground firefly-panorama-ground--center" />
        <div className="firefly-panorama-ground firefly-panorama-ground--east" />
        <img className="firefly-panorama-meadow" src={getFireflyAssetUrl(ASSETS.meadow)} alt="" decoding="async" />
        <Scenery asset="groundPatchA" className="firefly-terrain-patch firefly-terrain-patch--west" />
        <Scenery asset="groundPatchB" className="firefly-terrain-patch firefly-terrain-patch--center" />
        <Scenery asset="groundPatchA" className="firefly-terrain-patch firefly-terrain-patch--east" />
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--near">
        <Tree kind="deciduous2" name="near-west-a" depth="near" />
        <Tree kind="deciduous3" name="near-west-b" depth="near" />
        <Tree kind="deciduous3" name="near-center" depth="near" />
        <Tree kind="deciduous2" name="near-east-a" depth="near" />
        <Tree kind="coniferous3" name="near-east-b" depth="near" />
        <Tree kind="deciduous3" name="near-east-c" depth="near" />
        {stage >= 1 && (
          <>
            <div className="firefly-panorama-luma-pool" />
            <div className="firefly-panorama-landmark firefly-panorama-landmark--cottage">
              <span className="firefly-panorama-landmark__ground" /><span className="firefly-panorama-landmark__glow" />
              <img src={getFireflyAssetUrl(ASSETS.cottage)} alt="" decoding="async" />
            </div>
            <Scenery asset="bushRound" className="firefly-flora firefly-flora--cottage-bush" />
            <Scenery asset="flowerBush" className="firefly-flora firefly-flora--cottage-flowers" />
            <Scenery asset="wildflowers" className="firefly-flora firefly-flora--west-flowers" />
            <Scenery asset="mushroomAmanita" className="firefly-flora firefly-flora--west-mushroom-a" />
            <Scenery asset="mushroomAqua" className="firefly-flora firefly-flora--west-mushroom-b" />
          </>
        )}
        {stage >= 2 && (
          <>
            <div className="firefly-panorama-landmark firefly-panorama-landmark--rustic">
              <span className="firefly-panorama-landmark__ground" /><span className="firefly-panorama-landmark__glow" />
              <img src={getFireflyAssetUrl(ASSETS.rusticHouse)} alt="" decoding="async" loading="lazy" />
            </div>
            <Scenery asset="bushLow" className="firefly-flora firefly-flora--glade-bush" />
            <Scenery asset="wildflowers" className="firefly-flora firefly-flora--glade-flowers" />
            <Scenery asset="mushroomAqua" className="firefly-flora firefly-flora--glade-mushroom" />
            <div className="firefly-panorama-river">
              <span className="firefly-panorama-river__water firefly-panorama-river__water--upper" />
              <span className="firefly-panorama-river__water firefly-panorama-river__water--middle" />
              <span className="firefly-panorama-river__water firefly-panorama-river__water--lower" />
              <Scenery asset="wave1" className="firefly-river-wave firefly-river-wave--one" />
              <Scenery asset="wave2" className="firefly-river-wave firefly-river-wave--two" />
              <Scenery asset="wave3" className="firefly-river-wave firefly-river-wave--three" />
              <Scenery asset="groundPatchA" className="firefly-river-bank firefly-river-bank--upper" />
              <Scenery asset="groundPatchB" className="firefly-river-bank firefly-river-bank--lower" />
              <Scenery asset="waterRockA" className="firefly-river-rock firefly-river-rock--one" />
              <Scenery asset="waterRockB" className="firefly-river-rock firefly-river-rock--two" />
              <Scenery asset="reeds" className="firefly-river-reeds firefly-river-reeds--one" />
              <Scenery asset="reeds" className="firefly-river-reeds firefly-river-reeds--two" />
            </div>
          </>
        )}
        {stage >= 3 && (
          <>
            <div className="firefly-panorama-landmark firefly-panorama-landmark--treehouse">
              <span className="firefly-panorama-landmark__ground" /><span className="firefly-panorama-landmark__glow" />
              <img src={getFireflyAssetUrl(ASSETS.treeHouse)} alt="" decoding="async" loading="lazy" />
            </div>
            <Scenery asset="bridge" className="firefly-panorama-bridge-asset" />
            <Scenery asset="bushLow" className="firefly-flora firefly-flora--river-bush" />
            <Scenery asset="fern" className="firefly-flora firefly-flora--river-fern" />
            <Scenery asset="flowerBush" className="firefly-flora firefly-flora--east-flowers" />
          </>
        )}
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--foreground">
        <img className="firefly-panorama-foliage firefly-panorama-foliage--a" src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--b" src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--c" src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--d" src={getFireflyAssetUrl(ASSETS.foliage)} alt="" decoding="async" loading="lazy" />
        <Tree kind="deciduous2" name="foreground-west" depth="foreground" />
        <Tree kind="deciduous1" name="foreground-east" depth="foreground" />
        <Scenery asset="fern" className="firefly-foreground-plant firefly-foreground-plant--fern-west" />
        <Scenery asset="bushRound" className="firefly-foreground-plant firefly-foreground-plant--bush-west" />
        <Scenery asset="bushLow" className="firefly-foreground-plant firefly-foreground-plant--bush-center" />
        <Scenery asset="fern" className="firefly-foreground-plant firefly-foreground-plant--fern-east" />
        <Scenery asset="reeds" className="firefly-foreground-plant firefly-foreground-plant--reeds-east" />
      </div>
      <div className="firefly-panorama-color-grade" />
    </div>
  );
}
