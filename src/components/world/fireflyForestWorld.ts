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
}

export function addFireflyForest(scene: THREE.Scene, stage: 0 | 1 | 2 | 3): FireflyForestActors {
  const forest = new THREE.Group();
  const treeLayout = [
    [-5.5, 1.8, 4.7, 1.2, 0x234d3d], [-4.1, -1.7, 5.8, 1.35, 0x1d4437], [-2.8, 3.3, 4.3, 1.05, 0x315d48],
    [4.8, 1.9, 5.4, 1.3, 0x214a3a], [3.6, -2.3, 4.9, 1.18, 0x2c5b44], [5.8, -1.7, 4.1, 0.92, 0x37664d],
    [-0.4, -4.1, 5.7, 1.24, 0x1a4034], [1.7, -4.4, 4.8, 1.05, 0x2a5541],
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
    new THREE.MeshStandardMaterial({ color: 0x1b3b30, roughness: 1, flatShading: true }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.scale.y = 0.72;
  ground.position.y = -0.02;
  forest.add(ground);

  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 8.6, 1, 8),
    new THREE.MeshStandardMaterial({ color: 0x75644f, roughness: 1, transparent: true, opacity: 0.7 }),
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
  if (stage >= 3) {
    for (let index = 0; index < 7; index += 1) {
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + seededNoise(index, 15) * 0.04, 8, 6),
        new THREE.MeshStandardMaterial({
          color: index % 2 ? 0xe7d5ff : 0xbfe7c8,
          emissive: index % 2 ? 0x543873 : 0x315e46,
          emissiveIntensity: 0.45,
        }),
      );
      flower.position.set(-3.2 + index * 1.05, 0.11, 2.9 + Math.sin(index) * 0.35);
      forest.add(flower);
    }
  }

  scene.add(forest);
  return { forest, child, luma };
}
