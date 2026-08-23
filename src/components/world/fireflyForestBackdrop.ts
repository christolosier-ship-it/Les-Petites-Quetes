import * as THREE from 'three';
import { seededNoise } from './fireflyForestObjects';

export interface FireflyForestBackdrop {
  readonly starLayers: readonly THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>[];
  readonly moonHaloMaterial: THREE.MeshBasicMaterial;
  readonly moonHalo: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  readonly moonDisc: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
}

function createStarLayer(count: number, salt: number, size: number, opacity: number, color: number) {
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
    color,
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
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.32, 22, 16), haloMaterial);

  const disc = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 28, 20),
    new THREE.MeshBasicMaterial({ color: 0xfff2c7, fog: false }),
  );
  disc.position.z = 0.08;

  group.add(halo, disc);
  return { group, haloMaterial, halo, disc };
}

export function addFireflyForestBackdrop(scene: THREE.Scene, stage: 0 | 1 | 2 | 3): FireflyForestBackdrop {
  const starCounts = stage >= 3 ? [96, 62, 38] : stage >= 2 ? [74, 42, 26] : [54, 30, 18];
  const starLayers = [
    createStarLayer(starCounts[0] ?? 54, 41, 0.12, 0.74, 0xfff1c4),
    createStarLayer(starCounts[1] ?? 30, 51, 0.18, 0.58, 0xcfd6ff),
    createStarLayer(starCounts[2] ?? 18, 61, 0.25, stage >= 3 ? 0.64 : 0.44, 0xa7f5dd),
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
    const baseOpacity = index === 0 ? 0.68 : index === 1 ? 0.52 : stage >= 3 ? 0.58 : 0.4;
    layer.material.opacity = baseOpacity + Math.sin(elapsed * (0.72 + index * 0.17) + index * 1.9) * 0.15;
  });
  const moonPulse = (Math.sin(elapsed * 0.58) + 1) * 0.5;
  backdrop.moonHaloMaterial.opacity = 0.12 + moonPulse * (stage >= 3 ? 0.1 : 0.06);
  const haloScale = 1 + moonPulse * 0.055;
  backdrop.moonHalo.scale.setScalar(haloScale);
  backdrop.moonDisc.rotation.y = elapsed * 0.015;
}
