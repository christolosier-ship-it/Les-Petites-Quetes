import * as THREE from 'three';
import { createChildInPyjamas, createLuma } from './fireflyForestObjects';

export interface FireflyForestActors {
  readonly child: THREE.Group;
  readonly luma: THREE.Group;
}

/**
 * La couche Three.js ne porte plus le décor de la Forêt.
 *
 * Le paysage est rendu par le diorama illustré 2.5D. Three.js reste limité
 * aux acteurs et aux effets vivants afin de ne jamais dupliquer le paysage.
 */
export function addFireflyForest(scene: THREE.Scene, stage: 0 | 1 | 2 | 3): FireflyForestActors {
  const actors = new THREE.Group();
  actors.name = 'firefly-living-actors';
  actors.userData.stage = stage;

  const child = createChildInPyjamas();
  child.position.set(-1.05, 0, 0.65);
  child.rotation.y = 0.18;
  child.name = 'child-in-pyjamas';
  actors.add(child);

  const luma = createLuma();
  luma.position.set(0.1, 2.8, 0.45);
  luma.name = 'luma';
  actors.add(luma);

  scene.add(actors);
  return { child, luma };
}
