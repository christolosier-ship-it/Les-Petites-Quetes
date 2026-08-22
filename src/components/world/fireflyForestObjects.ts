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
    const spread = stage >= 3 ? 11 : 8.5;
    const values = [
      (seededNoise(index, 1) - 0.5) * spread,
      0.8 + seededNoise(index, 2) * 4.8,
      -2 + seededNoise(index, 3) * 8,
    ];
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
    map: texture ?? undefined,
    size: stage >= 3 ? 0.28 : 0.22,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return { points: new THREE.Points(geometry, material), basePositions, phases };
}

export function createTree(height: number, canopyScale: number, color: number) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.35, height * 0.58, 7),
    new THREE.MeshStandardMaterial({ color: 0x513c2d, roughness: 0.94 }),
  );
  trunk.position.y = height * 0.29;
  const foliage = new THREE.MeshStandardMaterial({ color, roughness: 0.88, flatShading: true });
  const low = new THREE.Mesh(new THREE.ConeGeometry(canopyScale, height * 0.46, 8), foliage);
  low.position.y = height * 0.62;
  const high = new THREE.Mesh(new THREE.ConeGeometry(canopyScale * 0.78, height * 0.38, 8), foliage);
  high.position.y = height * 0.84;
  group.add(trunk, low, high);
  return group;
}

export function createMushroom(scale = 1, glow = false) {
  const group = new THREE.Group();
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 0.42 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0xead8b5, roughness: 0.9 }),
  );
  stem.position.y = 0.21 * scale;
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.25 * scale, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.55),
    new THREE.MeshStandardMaterial({
      color: glow ? 0xcfffb0 : 0xb77057,
      emissive: glow ? 0x7abf55 : 0x000000,
      emissiveIntensity: glow ? 1.4 : 0,
      roughness: 0.78,
    }),
  );
  cap.scale.y = 0.55;
  cap.position.y = 0.45 * scale;
  group.add(stem, cap);
  return group;
}

export function createLantern() {
  const group = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.075, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x604a35, roughness: 0.9 }),
  );
  post.position.y = 0.75;
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 12, 8),
    new THREE.MeshStandardMaterial({ color: 0xffe7a0, emissive: 0xffba55, emissiveIntensity: 2.2 }),
  );
  lamp.position.y = 1.46;
  const light = new THREE.PointLight(0xffc76b, 1.5, 4.5, 2);
  light.position.copy(lamp.position);
  group.add(post, lamp, light);
  return group;
}

export function createBench() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x7b5a3b, roughness: 0.92, flatShading: true });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.12, 0.42), material);
  seat.position.y = 0.5;
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.12, 0.55), material);
  back.position.set(0, 0.82, 0.18);
  back.rotation.x = -0.12;
  const legGeometry = new THREE.BoxGeometry(0.1, 0.48, 0.1);
  const leftLeg = new THREE.Mesh(legGeometry, material);
  leftLeg.position.set(-0.48, 0.24, 0);
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.48;
  group.add(seat, back, leftLeg, rightLeg);
  return group;
}

export function createChildInPyjamas() {
  const child = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xdba982, roughness: 0.92, flatShading: true });
  const pyjama = new THREE.MeshStandardMaterial({ color: 0x6f79ac, roughness: 0.92, flatShading: true });
  const pyjamaLight = new THREE.MeshStandardMaterial({ color: 0x9aa4d0, roughness: 0.92, flatShading: true });
  const hair = new THREE.MeshStandardMaterial({ color: 0x5b3e2d, roughness: 0.95, flatShading: true });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 12, 9), skin);
  head.position.y = 2.06;
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 7, 0, Math.PI * 2, 0, Math.PI * 0.52), hair);
  hairCap.position.set(0, 2.14, 0.01);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.31, 0.68, 5, 9), pyjama);
  torso.position.y = 1.3;
  const arms = [-0.4, 0.4].map((x, index) => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.58, 4, 7), pyjamaLight);
    arm.position.set(x, 1.37, 0);
    arm.rotation.z = index === 0 ? 0.16 : -0.28;
    return arm;
  });
  const legs = [-0.17, 0.17].map((x) => {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.58, 4, 7), pyjamaLight);
    leg.position.set(x, 0.55, 0);
    return leg;
  });
  const slippers = [-0.17, 0.17].map((x) => {
    const slipper = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), pyjama);
    slipper.scale.set(1, 0.55, 1.35);
    slipper.position.set(x, 0.13, 0.08);
    return slipper;
  });
  child.add(head, hairCap, torso, ...arms, ...legs, ...slippers);
  child.scale.setScalar(0.88);
  return child;
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
