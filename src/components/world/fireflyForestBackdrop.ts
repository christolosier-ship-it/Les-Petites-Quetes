import * as THREE from 'three';
import { seededNoise } from './fireflyForestObjects';

export interface FireflyForestBackdrop {
  readonly starLayers: readonly THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>[];
  readonly moonHaloMaterial: THREE.MeshBasicMaterial;
  readonly moonHalo: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  readonly moonDisc: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  readonly windowMaterials: readonly THREE.MeshStandardMaterial[];
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
  group.position.set(-4.6, 7.15, -13.8);

  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0xdde8ff,
    transparent: true,
    opacity: 0.13,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.42, 22, 16), haloMaterial);

  const disc = new THREE.Mesh(
    new THREE.SphereGeometry(0.73, 28, 20),
    new THREE.MeshBasicMaterial({ color: 0xfff0bd, fog: false }),
  );
  disc.position.z = 0.08;

  group.add(halo, disc);
  return { group, haloMaterial, halo, disc };
}

function addDistantHills(scene: THREE.Scene, stage: 0 | 1 | 2 | 3) {
  const hills = new THREE.Group();
  const colors = stage >= 3 ? [0x14283b, 0x163342, 0x1a3a42] : [0x102b31, 0x153537, 0x173c39];
  const layout = [
    [-6.5, -10.5, 7.4, 1.05],
    [0.4, -12.8, 8.8, 1.25],
    [7.1, -10.8, 7.2, 1.0],
  ] as const;
  layout.forEach(([x, z, radius, heightScale], index) => {
    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 18, 9, 0, Math.PI * 2, 0, Math.PI * 0.58),
      new THREE.MeshStandardMaterial({ color: colors[index] ?? 0x102b31, roughness: 1, flatShading: true }),
    );
    hill.scale.y = 0.26 * heightScale;
    hill.position.set(x, -2.1, z);
    hills.add(hill);
  });
  scene.add(hills);
}

function createDistantPine(height: number, color: number) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.1, height * 0.42, 6),
    new THREE.MeshStandardMaterial({ color: 0x42382f, roughness: 1 }),
  );
  trunk.position.y = height * 0.21;
  const foliageMaterial = new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true });
  const low = new THREE.Mesh(new THREE.ConeGeometry(height * 0.22, height * 0.58, 7), foliageMaterial);
  low.position.y = height * 0.49;
  const high = new THREE.Mesh(new THREE.ConeGeometry(height * 0.17, height * 0.48, 7), foliageMaterial);
  high.position.y = height * 0.73;
  group.add(trunk, low, high);
  return group;
}

function addDistantForest(scene: THREE.Scene, stage: 0 | 1 | 2 | 3) {
  const group = new THREE.Group();
  const count = stage >= 3 ? 21 : stage >= 2 ? 17 : 13;
  for (let index = 0; index < count; index += 1) {
    const height = 1.4 + seededNoise(index, 71) * 2.2;
    const pine = createDistantPine(height, index % 2 ? 0x17372f : 0x1b4136);
    pine.position.set((seededNoise(index, 72) - 0.5) * 18, 0, -5.8 - seededNoise(index, 73) * 4.8);
    pine.rotation.y = seededNoise(index, 74) * Math.PI * 2;
    group.add(pine);
  }
  scene.add(group);
}

function createCottage(scale: number, warmMaterial: THREE.MeshStandardMaterial) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.1 * scale, 0.72 * scale, 0.76 * scale),
    new THREE.MeshStandardMaterial({ color: 0x66584b, roughness: 0.98, flatShading: true }),
  );
  body.position.y = 0.36 * scale;
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.82 * scale, 0.55 * scale, 4),
    new THREE.MeshStandardMaterial({ color: 0x3e3940, roughness: 0.96, flatShading: true }),
  );
  roof.position.y = 0.92 * scale;
  roof.rotation.y = Math.PI / 4;
  const windowGeometry = new THREE.BoxGeometry(0.18 * scale, 0.22 * scale, 0.025 * scale);
  const leftWindow = new THREE.Mesh(windowGeometry, warmMaterial);
  leftWindow.position.set(-0.25 * scale, 0.42 * scale, 0.395 * scale);
  const rightWindow = leftWindow.clone();
  rightWindow.position.x = 0.25 * scale;
  group.add(body, roof, leftWindow, rightWindow);
  return group;
}

function addDistantVillage(scene: THREE.Scene, stage: 0 | 1 | 2 | 3) {
  const group = new THREE.Group();
  const windowMaterials: THREE.MeshStandardMaterial[] = [];
  const houseCount = stage >= 3 ? 5 : stage >= 2 ? 3 : stage >= 1 ? 1 : 0;
  for (let index = 0; index < houseCount; index += 1) {
    const warmMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdf8a,
      emissive: 0xffb343,
      emissiveIntensity: stage >= 3 ? 2.1 : 1.45,
      roughness: 0.5,
    });
    windowMaterials.push(warmMaterial);
    const cottage = createCottage(0.62 + seededNoise(index, 81) * 0.22, warmMaterial);
    cottage.position.set(-5.8 + index * 2.9 + seededNoise(index, 82) * 0.6, 0.05, -6.6 - seededNoise(index, 83) * 2.0);
    cottage.rotation.y = (seededNoise(index, 84) - 0.5) * 0.5;
    group.add(cottage);
  }
  scene.add(group);
  return windowMaterials;
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
  addDistantHills(scene, stage);
  addDistantForest(scene, stage);
  const windowMaterials = addDistantVillage(scene, stage);

  return {
    starLayers,
    moonHaloMaterial: moon.haloMaterial,
    moonHalo: moon.halo,
    moonDisc: moon.disc,
    windowMaterials,
  };
}

export function animateFireflyForestBackdrop(elapsed: number, backdrop: FireflyForestBackdrop, stage: 0 | 1 | 2 | 3) {
  backdrop.starLayers.forEach((layer, index) => {
    const baseOpacity = index === 0 ? 0.66 : index === 1 ? 0.5 : stage >= 3 ? 0.55 : 0.38;
    layer.material.opacity = baseOpacity + Math.sin(elapsed * (0.72 + index * 0.17) + index * 1.9) * 0.16;
  });
  const moonPulse = (Math.sin(elapsed * 0.58) + 1) * 0.5;
  backdrop.moonHaloMaterial.opacity = 0.1 + moonPulse * (stage >= 3 ? 0.11 : 0.06);
  const haloScale = 1 + moonPulse * 0.055;
  backdrop.moonHalo.scale.setScalar(haloScale);
  backdrop.moonDisc.rotation.y = elapsed * 0.015;
  backdrop.windowMaterials.forEach((material, index) => {
    const flicker = (Math.sin(elapsed * (0.8 + index * 0.09) + index * 2.1) + 1) * 0.5;
    material.emissiveIntensity = (stage >= 3 ? 1.75 : 1.25) + flicker * 0.65;
  });
}
