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

function DistantHouse({ variant }: { readonly variant: 'cottage' | 'rustic' }) {
  const asset = variant === 'cottage' ? DIORAMA_ASSETS.cottage : DIORAMA_ASSETS.rusticHouse;
  return (
    <span className={`firefly-panorama-house firefly-panorama-house--${variant}`}>
      <i />
      <img src={getAssetUrl(asset)} alt="" decoding="async" />
    </span>
  );
}

function PanoramaTree({ name, depth = 'middle' }: { readonly name: string; readonly depth?: 'far' | 'middle' | 'near' }) {
  return (
    <span className={`firefly-panorama-tree firefly-panorama-tree--${depth} firefly-panorama-tree--${name}`}>
      <i />
      <img src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
    </span>
  );
}

export function FireflyForestIllustratedBackdrop({ stage, reducedMotion }: FireflyForestIllustratedBackdropProps) {
  return (
    <div
      className={`firefly-illustrated firefly-illustrated--stage-${stage}${reducedMotion ? ' firefly-illustrated--still' : ''}`}
      aria-hidden="true"
    >
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

        <div className="firefly-panorama-distant-woods">
          <PanoramaTree name="far-a" depth="far" />
          <PanoramaTree name="far-b" depth="far" />
          <PanoramaTree name="far-c" depth="far" />
          <PanoramaTree name="far-d" depth="far" />
          <PanoramaTree name="far-e" depth="far" />
          <PanoramaTree name="far-f" depth="far" />
          <PanoramaTree name="far-g" depth="far" />
          <PanoramaTree name="far-h" depth="far" />
        </div>

        {stage >= 3 && (
          <>
            <div className="firefly-panorama-village firefly-panorama-village--west">
              <DistantHouse variant="rustic" />
              <DistantHouse variant="cottage" />
              <DistantHouse variant="rustic" />
            </div>
            <div className="firefly-panorama-village firefly-panorama-village--east">
              <DistantHouse variant="cottage" />
              <DistantHouse variant="rustic" />
              <DistantHouse variant="cottage" />
              <DistantHouse variant="rustic" />
            </div>
          </>
        )}
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--middle">
        <div className="firefly-panorama-forestline firefly-panorama-forestline--west">
          <img src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
          <img src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
          <img src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
        </div>
        <div className="firefly-panorama-forestline firefly-panorama-forestline--east">
          <img src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
          <img src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
          <img src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
        </div>

        <div className="firefly-panorama-tree-grove firefly-panorama-tree-grove--middle">
          <PanoramaTree name="west-a" />
          <PanoramaTree name="west-b" />
          <PanoramaTree name="west-c" />
          <PanoramaTree name="west-d" />
          <PanoramaTree name="center-a" />
          <PanoramaTree name="center-b" />
          <PanoramaTree name="east-a" />
          <PanoramaTree name="east-b" />
          <PanoramaTree name="east-c" />
          <PanoramaTree name="east-d" />
        </div>

        <div className="firefly-panorama-ground firefly-panorama-ground--west" />
        <div className="firefly-panorama-ground firefly-panorama-ground--center" />
        <div className="firefly-panorama-ground firefly-panorama-ground--east" />

        <img
          className="firefly-panorama-meadow"
          src={getAssetUrl(DIORAMA_ASSETS.meadow)}
          alt=""
          decoding="async"
        />
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--near">
        <div className="firefly-panorama-tree-grove firefly-panorama-tree-grove--near">
          <PanoramaTree name="near-west-a" depth="near" />
          <PanoramaTree name="near-west-b" depth="near" />
          <PanoramaTree name="near-center-a" depth="near" />
          <PanoramaTree name="near-east-a" depth="near" />
          <PanoramaTree name="near-east-b" depth="near" />
          <PanoramaTree name="near-east-c" depth="near" />
        </div>

        {stage >= 1 && (
          <div className="firefly-panorama-landmark firefly-panorama-landmark--cottage">
            <span className="firefly-panorama-landmark__ground" />
            <span className="firefly-panorama-landmark__glow" />
            <img src={getAssetUrl(DIORAMA_ASSETS.cottage)} alt="" decoding="async" />
            <div className="firefly-panorama-flowerpatch firefly-panorama-flowerpatch--cottage" />
          </div>
        )}

        {stage >= 2 && (
          <>
            <div className="firefly-panorama-landmark firefly-panorama-landmark--rustic">
              <span className="firefly-panorama-landmark__ground" />
              <span className="firefly-panorama-landmark__glow" />
              <img src={getAssetUrl(DIORAMA_ASSETS.rusticHouse)} alt="" decoding="async" />
            </div>
            <div className="firefly-panorama-stream"><span /><i /></div>
            <div className="firefly-panorama-flowerpatch firefly-panorama-flowerpatch--glade" />
          </>
        )}

        {stage >= 3 && (
          <>
            <div className="firefly-panorama-landmark firefly-panorama-landmark--treehouse">
              <span className="firefly-panorama-landmark__ground" />
              <span className="firefly-panorama-landmark__glow" />
              <img src={getAssetUrl(DIORAMA_ASSETS.treeHouse)} alt="" decoding="async" />
            </div>
            <div className="firefly-panorama-bridge"><span /><span /><span /><span /><i /><b /></div>
            <div className="firefly-panorama-flowerpatch firefly-panorama-flowerpatch--village" />
            <div className="firefly-panorama-lanterns" />
          </>
        )}
      </div>

      <div className="firefly-panorama-layer firefly-panorama-layer--foreground">
        <img className="firefly-panorama-foliage firefly-panorama-foliage--a" src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--b" src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--c" src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
        <img className="firefly-panorama-foliage firefly-panorama-foliage--d" src={getAssetUrl(DIORAMA_ASSETS.foliage)} alt="" decoding="async" />
        <PanoramaTree name="foreground-west" depth="near" />
        <PanoramaTree name="foreground-east" depth="near" />
      </div>

      <div className="firefly-panorama-color-grade" />
    </div>
  );
}
