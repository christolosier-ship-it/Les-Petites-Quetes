import * as THREE from 'three';
import { createChildInPyjamas, createLuma } from './fireflyForestObjects';

export interface FireflyForestActors {
  readonly forest: THREE.Group;
  readonly child: THREE.Group;
  readonly luma: THREE.Group;
  readonly sparkleGroups: readonly THREE.Object3D[];
}

/**
 * La couche Three.js ne porte plus le décor de la Forêt.
 *
 * Le paysage est désormais rendu par le diorama illustré 2.5D. Three.js reste
 * volontairement limité aux acteurs et aux effets vivants afin d'éviter de
 * superposer l'ancien prototype low-poly au nouveau tableau illustré.
 */
export function addFireflyForest(scene: THREE.Scene, stage: 0 | 1 | 2 | 3): FireflyForestActors {
  const forest = new THREE.Group();
  forest.name = 'firefly-living-actors';
  forest.userData.stage = stage;

  const child = createChildInPyjamas();
  child.position.set(-1.05, 0, 0.65);
  child.rotation.y = 0.18;
  child.name = 'child-in-pyjamas';
  forest.add(child);

  const luma = createLuma();
  luma.position.set(0.1, 2.8, 0.45);
  luma.name = 'luma';
  forest.add(luma);

  scene.add(forest);
  return { forest, child, luma, sparkleGroups: [] };
}
