import * as THREE from 'three';

interface LivingAnimationActors {
  readonly child: THREE.Group;
  readonly luma: THREE.Group;
  readonly sparkleGroups: readonly THREE.Object3D[];
}

interface LivingAnimationState {
  childTarget: THREE.Vector3;
  nextWalkAt: number;
  nextGestureAt: number;
  gestureUntil: number;
  gestureKind: number;
  nextSparkleAt: number;
}

export function createLivingAnimationState(): LivingAnimationState {
  return {
    childTarget: new THREE.Vector3(-1.05, 0, 0.65),
    nextWalkAt: 3,
    nextGestureAt: 5,
    gestureUntil: 0,
    gestureKind: 0,
    nextSparkleAt: 4,
  };
}

function chooseChildTarget(elapsed: number, state: LivingAnimationState) {
  const angle = elapsed * 0.73 + Math.sin(elapsed * 0.31) * 1.8;
  const radius = 1.1 + (Math.sin(elapsed * 1.17) + 1) * 0.85;
  state.childTarget.set(Math.sin(angle) * radius - 0.3, 0, Math.cos(angle) * radius + 0.9);
  state.nextWalkAt = elapsed + 4.5 + (Math.sin(elapsed * 2.07) + 1) * 2.1;
}

export function animateLivingActors(
  elapsed: number,
  delta: number,
  actors: LivingAnimationActors,
  state: LivingAnimationState,
  stage: 0 | 1 | 2 | 3,
) {
  if (elapsed >= state.nextWalkAt) chooseChildTarget(elapsed, state);

  const toTarget = state.childTarget.clone().sub(actors.child.position);
  const distance = toTarget.length();
  if (distance > 0.08 && elapsed >= state.gestureUntil) {
    toTarget.normalize();
    const speed = 0.34 + stage * 0.035;
    actors.child.position.addScaledVector(toTarget, Math.min(distance, delta * speed));
    actors.child.rotation.y = THREE.MathUtils.lerp(actors.child.rotation.y, Math.atan2(toTarget.x, toTarget.z), 0.08);
    actors.child.position.y = Math.abs(Math.sin(elapsed * 4.8)) * 0.025;
    actors.child.rotation.z = Math.sin(elapsed * 4.8) * 0.02;
  } else {
    actors.child.position.y = 0;
    actors.child.rotation.z = Math.sin(elapsed * 1.15) * 0.008;
  }

  if (elapsed >= state.nextGestureAt) {
    state.gestureKind = Math.floor((Math.sin(elapsed * 1.91) + 1) * 1.5) % 3;
    state.gestureUntil = elapsed + 1.5 + (Math.sin(elapsed * 0.87) + 1) * 0.55;
    state.nextGestureAt = state.gestureUntil + 5 + (Math.sin(elapsed * 1.43) + 1) * 3.5;
  }
  if (elapsed < state.gestureUntil) {
    const pulse = Math.sin((state.gestureUntil - elapsed) * 7.5);
    if (state.gestureKind === 0) actors.child.rotation.z = pulse * 0.055;
    if (state.gestureKind === 1) actors.child.rotation.x = -0.08 + pulse * 0.025;
    if (state.gestureKind === 2) actors.child.scale.y = 0.88 + Math.abs(pulse) * 0.035;
  } else {
    actors.child.rotation.x = THREE.MathUtils.lerp(actors.child.rotation.x, 0, 0.08);
    actors.child.scale.y = THREE.MathUtils.lerp(actors.child.scale.y, 0.88, 0.08);
  }

  actors.luma.position.x = actors.child.position.x + Math.sin(elapsed * 0.9) * 0.75;
  actors.luma.position.z = actors.child.position.z + Math.cos(elapsed * 0.82) * 0.55;
  actors.luma.position.y = 2.45 + Math.sin(elapsed * 1.8) * 0.18;
  actors.luma.rotation.z = Math.sin(elapsed * 2.4) * 0.08;

  if (stage >= 3 && elapsed >= state.nextSparkleAt) {
    actors.sparkleGroups.forEach((object, index) => {
      object.visible = index % 2 === Math.floor(elapsed) % 2;
    });
    state.nextSparkleAt = elapsed + 2.6 + (Math.sin(elapsed * 1.33) + 1) * 1.7;
  }
}
