import * as THREE from 'three';
import {
  createBench,
  createChildInPyjamas,
  createLantern,
  createLuma,
  createMushroom,
  createTree,
  seededNoise,
} from './fireflyForestObjects';

export interface FireflyForestActors {
  readonly forest: THREE.Group;
  readonly child: THREE.Group;
  readonly luma: THREE.Group;
  readonly sparkleGroups: readonly THREE.Object3D[];
}

function addMoonArch(forest: THREE.Group) {
  const arch = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x7b624d, roughness: 0.95, flatShading: true });
  const left = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 2.8, 8), material);
  left.position.set(-1.25, 1.4, 3.65);
  left.rotation.z = -0.08;
  const right = left.clone();
  right.position.x = 1.25;
  right.rotation.z = 0.08;
  const top = new THREE.Mesh(new THREE.TorusGeometry(1.27, 0.11, 8, 24, Math.PI), material);
  top.position.set(0, 2.75, 3.65);
  top.rotation.z = Math.PI;
  arch.add(left, right, top);
  forest.add(arch);
}

function addDreamLights(forest: THREE.Group) {
  const group = new THREE.Group();
  for (let index = 0; index < 12; index += 1) {
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.055 + seededNoise(index, 31) * 0.04),
      new THREE.MeshStandardMaterial({
        color: index % 3 === 0 ? 0xd7c6ff : index % 2 ? 0xc9fff0 : 0xffefad,
        emissive: index % 3 === 0 ? 0x59447a : index % 2 ? 0x2f7166 : 0x8c6a21,
        emissiveIntensity: 1.4,
      }),
    );
    const angle = (index / 12) * Math.PI * 2;
    crystal.position.set(Math.cos(angle) * 4.4, 0.18 + seededNoise(index, 32) * 1.3, 1.6 + Math.sin(angle) * 3.4);
    crystal.userData.sparkle = true;
    group.add(crystal);
  }
  forest.add(group);
  return group.children;
}

export function addFireflyForest(scene: THREE.Scene, stage: 0 | 1 | 2 | 3): FireflyForestActors {
  const forest = new THREE.Group();
  const treeLayout = [
    [-6.1, 2.2, 5.4, 1.38, 0x173d32],
    [-5.35, -2.4, 6.0, 1.44, 0x1b4336],
    [5.65, 2.5, 5.7, 1.42, 0x1b4537],
    [6.2, -2.0, 5.1, 1.28, 0x22513e],
    [4.7, -4.3, 4.2, 1.02, 0x294f3e],
  ] as const;
  treeLayout.forEach(([x, z, height, canopy, color], index) => {
    const tree = createTree(height, canopy, color);
    tree.position.set(x, 0, z);
    tree.rotation.y = seededNoise(index, 9) * Math.PI * 2;
    tree.userData.swayPhase = seededNoise(index, 10) * Math.PI * 2;
    forest.add(tree);
  });

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(8.8, 48),
    new THREE.MeshStandardMaterial({
      color: stage >= 3 ? 0x21483a : 0x17372e,
      roughness: 1,
      flatShading: true,
      transparent: true,
      opacity: stage >= 3 ? 0.34 : 0.48,
      depthWrite: false,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.scale.y = 0.72;
  ground.position.y = -0.02;
  forest.add(ground);

  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 8.6, 1, 8),
    new THREE.MeshStandardMaterial({
      color: stage >= 3 ? 0x9a856b : 0x75644f,
      roughness: 1,
      transparent: true,
      opacity: stage >= 3 ? 0.32 : 0.44,
      depthWrite: false,
    }),
  );
  path.rotation.x = -Math.PI / 2;
  path.rotation.z = -0.14;
  path.position.set(0.6, 0.01, 1.7);
  forest.add(path);

  const child = createChildInPyjamas();
  child.position.set(-1.05, 0, 0.65);
  child.rotation.y = 0.18;
  child.name = 'child-in-pyjamas';
  forest.add(child);

  const luma = createLuma();
  luma.position.set(0.1, 2.8, 0.45);
  luma.name = 'luma';
  forest.add(luma);

  const mushroomPositions = [[-2.2, 0.2], [2.35, 0.4], [1.8, 2.1], [-3.1, 2.5]] as const;
  const mushroomCount = stage >= 2 ? 4 : stage >= 1 ? 2 : 1;
  mushroomPositions.slice(0, mushroomCount).forEach(([x, z], index) => {
    const mushroom = createMushroom(0.8 + index * 0.08, stage >= 2 && index % 2 === 0);
    mushroom.position.set(x, 0, z);
    forest.add(mushroom);
  });

  if (stage >= 1) {
    const lantern = createLantern();
    lantern.position.set(2.15, 0, -0.45);
    forest.add(lantern);
  }
  if (stage >= 2) {
    const bench = createBench();
    bench.position.set(2.65, 0, 2.15);
    bench.rotation.y = -0.55;
    forest.add(bench);
  }

  const sparkleGroups: THREE.Object3D[] = [];
  if (stage >= 3) {
    addMoonArch(forest);
    sparkleGroups.push(...addDreamLights(forest));
    for (let index = 0; index < 11; index += 1) {
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + seededNoise(index, 15) * 0.04, 8, 6),
        new THREE.MeshStandardMaterial({
          color: index % 3 === 0 ? 0xf3d7ff : index % 2 ? 0xe7d5ff : 0xbfe7c8,
          emissive: index % 3 === 0 ? 0x6d477d : index % 2 ? 0x543873 : 0x315e46,
          emissiveIntensity: 0.85,
        }),
      );
      flower.position.set(-4.15 + index * 0.82, 0.11 + seededNoise(index, 17) * 0.08, 2.9 + Math.sin(index * 0.8) * 0.48);
      forest.add(flower);
      sparkleGroups.push(flower);
    }
    scene.add(new THREE.PointLight(0xbda6ff, 1.25, 10, 2));
  }

  scene.add(forest);
  return { forest, child, luma, sparkleGroups };
}
