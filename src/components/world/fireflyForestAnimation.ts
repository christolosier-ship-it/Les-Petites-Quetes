import * as THREE from 'three';

interface LivingAnimationActors {
  readonly luma: THREE.Group;
}

interface LivingAnimationState {
  readonly lumaBase: THREE.Vector3;
  readonly lumaTarget: THREE.Vector3;
  nextTargetAt: number;
}

export function createLivingAnimationState(): LivingAnimationState {
  return {
    lumaBase: new THREE.Vector3(-0.15, 2.75, 0.45),
    lumaTarget: new THREE.Vector3(-0.15, 2.75, 0.45),
    nextTargetAt: 0,
  };
}

function chooseLumaTarget(elapsed: number, stage: 0 | 1 | 2 | 3, state: LivingAnimationState) {
  const travel = 1.25 + stage * 0.22;
  state.lumaTarget.set(
    Math.sin(elapsed * 0.63) * travel + Math.sin(elapsed * 0.21) * 0.55,
    2.35 + Math.sin(elapsed * 0.47) * 0.52,
    0.55 + Math.cos(elapsed * 0.39) * 0.72,
  );
  state.nextTargetAt = elapsed + 3.6 + (Math.sin(elapsed * 0.91) + 1) * 1.6;
}

export function animateLivingActors(
  elapsed: number,
  delta: number,
  actors: LivingAnimationActors,
  state: LivingAnimationState,
  stage: 0 | 1 | 2 | 3,
) {
  if (elapsed >= state.nextTargetAt) chooseLumaTarget(elapsed, stage, state);

  const follow = Math.min(1, delta * (0.72 + stage * 0.05));
  state.lumaBase.lerp(state.lumaTarget, follow);
  actors.luma.position.copy(state.lumaBase);
  actors.luma.position.y += Math.sin(elapsed * 2.15) * 0.13;
  actors.luma.position.x += Math.sin(elapsed * 1.05) * 0.08;
  actors.luma.rotation.z = Math.sin(elapsed * 2.45) * 0.11;
  actors.luma.rotation.y = Math.sin(elapsed * 0.72) * 0.22;
}
