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
    positions[offset] = (seededNoise(index, salt) - 0.5) * 28;
    positions[offset + 1] = 4.6 + seededNoise(index, salt + 1) * 8.2;
    positions[offset + 2] = -9 - seededNoise(index, salt + 2) * 25;
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
    opacity: 0.14,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.3, 22, 16), haloMaterial);

  const disc = new THREE.Mesh(
    new THREE.SphereGeometry(0.73, 28, 20),
    new THREE.MeshBasicMaterial({ color: 0xfff2c6, fog: false }),
  );
  disc.position.z = 0.08;

  group.add(halo, disc);
  return { group, haloMaterial, halo, disc };
}

export function addFireflyForestBackdrop(scene: THREE.Scene, stage: 0 | 1 | 2 | 3): FireflyForestBackdrop {
  const starCounts = stage >= 3 ? [160, 72, 24, 6] : stage >= 2 ? [118, 54, 18, 5] : [82, 38, 14, 4];
  const starLayers = [
    createStarLayer(starCounts[0] ?? 82, 41, 0.075, 0.56, 0xfff2c4),
    createStarLayer(starCounts[1] ?? 38, 51, 0.12, 0.5, 0xbdebdc),
    createStarLayer(starCounts[2] ?? 14, 61, 0.19, stage >= 3 ? 0.62 : 0.48, 0xcabfff),
    createStarLayer(starCounts[3] ?? 4, 73, 0.28, stage >= 3 ? 0.76 : 0.62, 0xffd98b),
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
  const bases = stage >= 3 ? [0.52, 0.46, 0.57, 0.7] : [0.48, 0.42, 0.48, 0.58];
  backdrop.starLayers.forEach((layer, index) => {
    const speed = 0.55 + index * 0.23;
    const amplitude = index === 3 ? 0.15 : 0.11 + index * 0.015;
    layer.material.opacity = (bases[index] ?? 0.58) + Math.sin(elapsed * speed + index * 1.73) * amplitude;
    layer.rotation.z = Math.sin(elapsed * 0.025 + index) * 0.0025;
  });

  const moonPulse = (Math.sin(elapsed * 0.58) + 1) * 0.5;
  backdrop.moonHaloMaterial.opacity = 0.1 + moonPulse * (stage >= 3 ? 0.11 : 0.06);
  const haloScale = 1 + moonPulse * 0.055;
  backdrop.moonHalo.scale.setScalar(haloScale);
  backdrop.moonDisc.rotation.y = elapsed * 0.015;
}
