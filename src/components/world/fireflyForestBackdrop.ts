import * as THREE from 'three';
import { seededNoise } from './fireflyForestObjects';

export interface FireflyForestBackdrop {
  readonly starLayers: readonly THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>[];
  readonly moonHaloMaterial: THREE.MeshBasicMaterial;
  readonly moonHalo: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  readonly moonDisc: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
}

function createStarLayer(count: number, salt: number, size: number, opacity: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (seededNoise(index, salt) - 0.5) * 24;
    positions[offset + 1] = 4.8 + seededNoise(index, salt + 1) * 7.4;
    positions[offset + 2] = -10 - seededNoise(index, salt + 2) * 22;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xf7f1cf,
    size,
    transparent: true,
    opacity,
    depthWrite: false,
    sizeAttenuation: true,
    fog: false,
  });
  return new THREE.Points(geometry, material);
}

function createMoon() {
  const group = new THREE.Group();
  group.position.set(-4.55, 6.72, -13.8);

  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0xdde8ff,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.28, 22, 16), haloMaterial);

  const disc = new THREE.Mesh(
    new THREE.SphereGeometry(0.73, 28, 20),
    new THREE.MeshBasicMaterial({ color: 0xfff0bd, fog: false }),
  );
  disc.position.z = 0.08;

  group.add(halo, disc);
  return { group, haloMaterial, halo, disc };
}

export function addFireflyForestBackdrop(scene: THREE.Scene, stage: 0 | 1 | 2 | 3): FireflyForestBackdrop {
  const starCounts = stage >= 3 ? [90, 55, 32] : stage >= 2 ? [70, 38, 22] : [52, 28, 16];
  const starLayers = [
    createStarLayer(starCounts[0] ?? 52, 41, 0.12, 0.72),
    createStarLayer(starCounts[1] ?? 28, 51, 0.18, 0.58),
    createStarLayer(starCounts[2] ?? 16, 61, 0.25, stage >= 3 ? 0.62 : 0.42),
  ];
  scene.add(...starLayers);

  const moon = createMoon();
  scene.add(moon.group);

  return {
    starLayers,
    moonHaloMaterial: moon.haloMaterial,
    moonHalo: moon.halo,
    moonDisc: moon.disc,
  };
}

export function animateFireflyForestBackdrop(elapsed: number, backdrop: FireflyForestBackdrop, stage: 0 | 1 | 2 | 3) {
  backdrop.starLayers.forEach((layer, index) => {
    const baseOpacity = index === 0 ? 0.66 : index === 1 ? 0.5 : stage >= 3 ? 0.55 : 0.38;
    layer.material.opacity = baseOpacity + Math.sin(elapsed * (0.72 + index * 0.17) + index * 1.9) * 0.16;
  });
  const moonPulse = (Math.sin(elapsed * 0.58) + 1) * 0.5;
  backdrop.moonHaloMaterial.opacity = 0.09 + moonPulse * (stage >= 3 ? 0.1 : 0.055);
  const haloScale = 1 + moonPulse * 0.05;
  backdrop.moonHalo.scale.setScalar(haloScale);
  backdrop.moonDisc.rotation.y = elapsed * 0.015;
}
