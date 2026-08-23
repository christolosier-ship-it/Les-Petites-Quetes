import { useEffect, useRef, useState } from 'react';
import { getFireflyAssetUrl } from '../../assets/registry/fireflyCatalog';

interface FireflyForestWildlifeProps {
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
  readonly active: boolean;
}

type WildlifeMoment = 'idle' | 'fox' | 'owl' | 'badger' | 'rabbit' | 'deer' | 'bats' | 'girl-look' | 'girl-crouch' | 'starfall';

const WILDLIFE_ASSETS = {
  fox: 'world.firefly-forest.wildlife-fox-glitch',
  owl: 'world.firefly-forest.wildlife-owl-openclipart',
  badger: 'world.firefly-forest.wildlife-badger-openclipart',
  rabbit: 'world.firefly-forest.wildlife-rabbit-gdquest',
  deer: 'world.firefly-forest.wildlife-fawn-openclipart',
  bat: 'world.firefly-forest.wildlife-bat-openclipart',
  hedgehog: 'world.firefly-forest.wildlife-hedgehog-openclipart',
  girl: 'world.firefly-forest.character-girl-openclipart',
} as const;

const MOMENT_DURATION: Record<Exclude<WildlifeMoment, 'idle'>, number> = {
  fox: 6200,
  owl: 4800,
  badger: 5600,
  rabbit: 3600,
  deer: 4400,
  bats: 6500,
  'girl-look': 5200,
  'girl-crouch': 4200,
  starfall: 1800,
};

function momentsForStage(stage: 0 | 1 | 2 | 3): readonly Exclude<WildlifeMoment, 'idle'>[] {
  if (stage === 0) return [];
  if (stage === 1) return ['girl-look', 'girl-crouch'];
  if (stage === 2) return ['fox', 'owl', 'rabbit', 'girl-look', 'girl-crouch', 'starfall'];
  return ['fox', 'owl', 'badger', 'rabbit', 'deer', 'bats', 'girl-look', 'girl-crouch', 'starfall'];
}

function Sprite({ asset, className }: { readonly asset: keyof typeof WILDLIFE_ASSETS; readonly className: string }) {
  return <img className={className} src={getFireflyAssetUrl(WILDLIFE_ASSETS[asset])} alt="" decoding="async" loading="lazy" />;
}

export function FireflyForestWildlife({ stage, reducedMotion, active }: FireflyForestWildlifeProps) {
  const [moment, setMoment] = useState<WildlifeMoment>('idle');
  const lastMomentRef = useRef<WildlifeMoment>('idle');

  useEffect(() => {
    if (!active || reducedMotion || stage === 0) return;

    let nextTimer = 0;
    let clearTimer = 0;
    let cancelled = false;

    const schedule = () => {
      const delay = 8000 + Math.random() * 18000;
      nextTimer = window.setTimeout(() => {
        if (cancelled) return;
        const stageMoments = momentsForStage(stage);
        const available = stageMoments.filter((entry) => entry !== lastMomentRef.current);
        const pool = available.length > 0 ? available : stageMoments;
        const next = pool[Math.floor(Math.random() * pool.length)] ?? 'girl-look';
        lastMomentRef.current = next;
        setMoment(next);
        clearTimer = window.setTimeout(() => {
          if (cancelled) return;
          setMoment('idle');
          schedule();
        }, MOMENT_DURATION[next]);
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(nextTimer);
      window.clearTimeout(clearTimer);
    };
  }, [active, reducedMotion, stage]);

  const visibleMoment = active && !reducedMotion ? moment : 'idle';

  return (
    <div className={`firefly-wildlife firefly-wildlife--${visibleMoment}${reducedMotion ? ' firefly-wildlife--still' : ''}`} data-firefly-wildlife="true" data-firefly-moment={visibleMoment} aria-hidden="true">
      {stage >= 1 && <><span className="firefly-wildlife__girl-glow" /><Sprite asset="girl" className="firefly-wildlife__girl" /><Sprite asset="hedgehog" className="firefly-wildlife__animal firefly-wildlife__hedgehog" /></>}
      {stage >= 2 && <><Sprite asset="fox" className="firefly-wildlife__animal firefly-wildlife__fox" /><Sprite asset="owl" className="firefly-wildlife__animal firefly-wildlife__owl" /><Sprite asset="rabbit" className="firefly-wildlife__animal firefly-wildlife__rabbit" /></>}
      {stage >= 3 && <><Sprite asset="badger" className="firefly-wildlife__animal firefly-wildlife__badger" /><Sprite asset="deer" className="firefly-wildlife__animal firefly-wildlife__deer" /><div className="firefly-wildlife__bats"><Sprite asset="bat" className="firefly-wildlife__bat firefly-wildlife__bat--one" /><Sprite asset="bat" className="firefly-wildlife__bat firefly-wildlife__bat--two" /><Sprite asset="bat" className="firefly-wildlife__bat firefly-wildlife__bat--three" /></div></>}
      <span className="firefly-wildlife__starfall" />
    </div>
  );
}
