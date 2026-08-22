interface FireflyForestIllustratedBackdropProps {
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
}

const OPENCLIPART = {
  meadow: 'https://openclipart.org/image/800px/251204',
  cottage: 'https://openclipart.org/image/800px/311437',
  rusticHouse: 'https://openclipart.org/image/800px/299648',
  treeHouse: 'https://openclipart.org/image/800px/298682',
  foliage: 'https://openclipart.org/image/800px/208754',
} as const;

export const FIREFLY_FOREST_REMOTE_ASSETS = Object.values(OPENCLIPART);

export function FireflyForestIllustratedBackdrop({ stage, reducedMotion }: FireflyForestIllustratedBackdropProps) {
  return (
    <div
      className={`firefly-illustrated firefly-illustrated--stage-${stage}${reducedMotion ? ' firefly-illustrated--still' : ''}`}
      aria-hidden="true"
    >
      <div className="firefly-illustrated__sky" />
      <img className="firefly-illustrated__meadow" src={OPENCLIPART.meadow} alt="" decoding="async" />
      <div className="firefly-illustrated__horizon-haze" />

      {stage >= 1 && (
        <div className="firefly-illustrated__house firefly-illustrated__house--cottage">
          <span className="firefly-illustrated__house-glow" />
          <img src={OPENCLIPART.cottage} alt="" decoding="async" />
        </div>
      )}

      {stage >= 2 && (
        <div className="firefly-illustrated__house firefly-illustrated__house--rustic">
          <span className="firefly-illustrated__house-glow" />
          <img src={OPENCLIPART.rusticHouse} alt="" decoding="async" />
        </div>
      )}

      {stage >= 3 && (
        <div className="firefly-illustrated__house firefly-illustrated__house--tree">
          <span className="firefly-illustrated__house-glow" />
          <img src={OPENCLIPART.treeHouse} alt="" decoding="async" />
        </div>
      )}

      {stage >= 2 && <div className="firefly-illustrated__stream"><span /></div>}

      <img className="firefly-illustrated__foliage firefly-illustrated__foliage--left" src={OPENCLIPART.foliage} alt="" decoding="async" />
      <img className="firefly-illustrated__foliage firefly-illustrated__foliage--right" src={OPENCLIPART.foliage} alt="" decoding="async" />
      <div className="firefly-illustrated__mist firefly-illustrated__mist--far" />
      <div className="firefly-illustrated__mist firefly-illustrated__mist--near" />
      <div className="firefly-illustrated__grade" />
    </div>
  );
}
