import * as THREE from 'three';
import {
  createBarkTexture,
  createGroundDetailTexture,
  createRockTexture,
} from './Textures';
import type { SnowTrail } from '../world/SnowTrail';

/**
 * Shared, procedurally textured PBR materials. Built once per world and
 * reused by every chunk so material count stays tiny.
 */
export class MaterialLibrary {
  readonly terrain: THREE.MeshStandardMaterial;
  readonly bark: THREE.MeshStandardMaterial;
  readonly barkBirch: THREE.MeshStandardMaterial;
  readonly deadWood: THREE.MeshStandardMaterial;
  readonly rock: THREE.MeshStandardMaterial;
  readonly stone: THREE.MeshStandardMaterial;
  readonly log: THREE.MeshStandardMaterial;
  readonly crate: THREE.MeshStandardMaterial;
  readonly charcoal: THREE.MeshStandardMaterial;
  readonly ancientStone: THREE.MeshStandardMaterial;
  readonly crystal: THREE.MeshStandardMaterial;
  readonly bone: THREE.MeshStandardMaterial;
  readonly mossStone: THREE.MeshStandardMaterial;

  private disposables: Array<{ dispose(): void }> = [];

  constructor(seed: number, snowTrail?: SnowTrail) {
    const groundDetail = createGroundDetailTexture(seed);
    groundDetail.repeat.set(24, 24);

    this.terrain = new THREE.MeshStandardMaterial({
      vertexColors: true,
      map: groundDetail,
      // Per-pixel bump from the detail texture breaks up flat triangle
      // shading on steep rock faces (hides mesh faceting up close).
      bumpMap: groundDetail,
      bumpScale: 0.55,
      roughness: 0.96,
      metalness: 0,
    });
    if (snowTrail) this.wireSnowTrail(this.terrain, snowTrail);

    const barkTex = createBarkTexture(seed, new THREE.Color(0x6e5740));
    barkTex.repeat.set(1.6, 2.5);
    this.bark = new THREE.MeshStandardMaterial({ map: barkTex, roughness: 0.92 });

    const birchTex = createBarkTexture(seed + 1, new THREE.Color(0x8d8678));
    birchTex.repeat.set(1.6, 2.5);
    this.barkBirch = new THREE.MeshStandardMaterial({ map: birchTex, roughness: 0.9 });

    const deadTex = createBarkTexture(seed + 2, new THREE.Color(0x6d6357));
    this.deadWood = new THREE.MeshStandardMaterial({ map: deadTex, roughness: 0.95 });

    const rockTex = createRockTexture(seed);
    this.rock = new THREE.MeshStandardMaterial({ map: rockTex, roughness: 0.94 });
    this.stone = new THREE.MeshStandardMaterial({ map: rockTex, roughness: 0.92 });

    const logTex = createBarkTexture(seed + 5, new THREE.Color(0x4f4334));
    this.log = new THREE.MeshStandardMaterial({ map: logTex, roughness: 0.95 });

    const crateTex = createBarkTexture(seed + 6, new THREE.Color(0x7a6244));
    crateTex.repeat.set(2, 2);
    this.crate = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.85 });

    this.charcoal = new THREE.MeshStandardMaterial({ color: 0x1d1a18, roughness: 1.0 });

    const ancientTex = createRockTexture(seed + 7);
    this.ancientStone = new THREE.MeshStandardMaterial({
      map: ancientTex,
      color: 0xa8a294,
      roughness: 0.9,
    });

    this.bone = new THREE.MeshStandardMaterial({
      color: 0xcfc4ad,
      roughness: 0.78,
    });

    const mossTex = createRockTexture(seed + 8);
    this.mossStone = new THREE.MeshStandardMaterial({
      map: mossTex,
      color: 0x8fa07c,
      roughness: 0.96,
    });

    this.crystal = new THREE.MeshStandardMaterial({
      color: 0x7fd4ff,
      emissive: 0x3fa8e0,
      emissiveIntensity: 1.4,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92,
    });

    this.disposables.push(
      groundDetail, barkTex, birchTex, deadTex, rockTex, logTex, crateTex, ancientTex, mossTex,
      this.terrain, this.bark, this.barkBirch, this.deadWood,
      this.rock, this.stone, this.log,
      this.crate, this.charcoal, this.ancientStone, this.crystal,
      this.bone, this.mossStone,
    );
  }

  /**
   * Snow trail deformation: the terrain vertex stage samples the moving
   * depression window (depressing snowy vertices), the fragment stage shades
   * the compacted trough slightly darker and bluer.
   */
  private wireSnowTrail(material: THREE.MeshStandardMaterial, snowTrail: SnowTrail): void {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTrailMap = snowTrail.uniforms.uTrailMap;
      shader.uniforms.uTrailRegion = snowTrail.uniforms.uTrailRegion;

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
attribute float aSnow;
uniform sampler2D uTrailMap;
uniform vec4 uTrailRegion; // origin x, origin z, 1/size, strength
varying float vTrail;`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
{
  vec4 trailWp = modelMatrix * vec4(transformed, 1.0);
  vec2 trailUv = (trailWp.xz - uTrailRegion.xy) * uTrailRegion.z;
  float inWindow =
    step(abs(trailUv.x - 0.5), 0.5) * step(abs(trailUv.y - 0.5), 0.5);
  float depression = texture2D(uTrailMap, clamp(trailUv, 0.0, 1.0)).a;
  vTrail = depression * inWindow * aSnow * uTrailRegion.w;
  transformed.y -= vTrail * 0.22;
}`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying float vTrail;`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.62, 0.68, 0.84), vTrail);`,
        );
    };
    material.customProgramCacheKey = () => 'terrainSnowTrail';
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
    this.disposables.length = 0;
  }
}
