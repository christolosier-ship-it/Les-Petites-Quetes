import * as THREE from 'three';
import { createLuma } from './fireflyForestObjects';

export interface FireflyForestActors {
  readonly luma: THREE.Group;
}

/**
 * La couche Three.js ne porte plus le décor de la Forêt.
 *
 * Le paysage et les éléments de progression sont rendus par le diorama
 * illustré 2.5D. Three.js reste limité à Luma et aux effets lumineux vivants.
 */
export function addFireflyForest(scene: THREE.Scene): FireflyForestActors {
  const actors = new THREE.Group();
  actors.name = 'firefly-living-actors';

  const luma = createLuma();
  luma.position.set(-0.15, 2.75, 0.45);
  luma.name = 'luma';
  actors.add(luma);

  scene.add(actors);
  return { luma };
}
