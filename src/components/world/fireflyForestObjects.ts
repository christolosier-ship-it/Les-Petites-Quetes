import * as THREE from 'three';

export interface AnimatedFireflies {
  readonly points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  readonly basePositions: Float32Array;
  readonly phases: Float32Array;
}

export function seededNoise(index: number, salt: number) {
  const value = Math.sin(index * 91.137 + salt * 17.731) * 43758.5453;
  return value - Math.floor(value);
}

function createFireflyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (!context) return null;
  const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 30);
  gradient.addColorStop(0, 'rgba(255, 255, 214, 1)');
  gradient.addColorStop(0.24, 'rgba(255, 231, 122, 0.96)');
  gradient.addColorStop(0.62, 'rgba(206, 255, 132, 0.35)');
  gradient.addColorStop(1, 'rgba(206, 255, 132, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createFireflies(count: number, stage: number): AnimatedFireflies {
  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const highFlyer = seededNoise(index, 7) > 0.84;
    const clusterCenter = seededNoise(index, 8) > 0.5 ? -2.25 : 2.15;
    const clusterSpread = stage >= 3 ? 4.8 : 3.9;
    const x = THREE.MathUtils.clamp(
      clusterCenter + (seededNoise(index, 1) - 0.5) * clusterSpread,
      -5.1,
      5.1,
    );
    const yNoise = seededNoise(index, 2);
    const y = highFlyer
      ? 2.65 + yNoise * 1.85
      : 0.62 + Math.pow(yNoise, 1.7) * (stage >= 3 ? 2.85 : 2.35);
    const z = -1.6 + seededNoise(index, 3) * 6.4;
    const values = [x, y, z];
    values.forEach((value, axis) => {
      positions[offset + axis] = value;
      basePositions[offset + axis] = value;
    });
    phases[index] = seededNoise(index, 4) * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const texture = createFireflyTexture();
  const material = new THREE.PointsMaterial({
    color: 0xffec91,
    map: texture,
    size: stage >= 3 ? 0.24 : 0.2,
    transparent: true,
    opacity: 0.84,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return { points: new THREE.Points(geometry, material), basePositions, phases };
}

export function createLuma() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 8),
    new THREE.MeshStandardMaterial({ color: 0xffe694, emissive: 0xffc44c, emissiveIntensity: 2.7 }),
  );
  body.scale.set(0.78, 1.22, 0.72);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 12, 8),
    new THREE.MeshStandardMaterial({ color: 0x4a4339, roughness: 0.8 }),
  );
  head.position.y = 0.22;
  const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xe8fff5, transparent: true, opacity: 0.55, roughness: 0.3 });
  const wingGeometry = new THREE.SphereGeometry(0.18, 10, 7);
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.scale.set(0.62, 1.55, 0.2);
  leftWing.position.set(-0.19, 0.02, 0);
  leftWing.rotation.z = 0.58;
  const rightWing = leftWing.clone();
  rightWing.position.x = 0.19;
  rightWing.rotation.z = -0.58;
  group.add(body, head, leftWing, rightWing, new THREE.PointLight(0xffd46e, 2.2, 3.2, 2));
  return group;
}
