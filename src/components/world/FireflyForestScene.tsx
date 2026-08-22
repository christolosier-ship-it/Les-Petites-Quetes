import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FireflyForestSceneProps {
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
}

interface AnimatedFireflies {
  readonly points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  readonly basePositions: Float32Array;
  readonly phases: Float32Array;
}

function seededNoise(index: number, salt: number) {
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

function createFireflies(count: number, stage: number): AnimatedFireflies {
  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    const spread = stage >= 3 ? 11 : 8.5;
    const x = (seededNoise(index, 1) - 0.5) * spread;
    const y = 0.8 + seededNoise(index, 2) * 4.8;
    const z = -2 + seededNoise(index, 3) * 8;
    const offset = index * 3;
    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = z;
    basePositions[offset] = x;
    basePositions[offset + 1] = y;
    basePositions[offset + 2] = z;
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

function createTree(height: number, canopyScale: number, color: number) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.35, height * 0.58, 7),
    new THREE.MeshStandardMaterial({ color: 0x513c2d, roughness: 0.94 }),
  );
  trunk.position.y = height * 0.29;
  const foliageMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.88, flatShading: true });
  const canopyLow = new THREE.Mesh(new THREE.ConeGeometry(canopyScale, height * 0.46, 8), foliageMaterial);
  canopyLow.position.y = height * 0.62;
  const canopyHigh = new THREE.Mesh(new THREE.ConeGeometry(canopyScale * 0.78, height * 0.38, 8), foliageMaterial);
  canopyHigh.position.y = height * 0.84;
  group.add(trunk, canopyLow, canopyHigh);
  return group;
}

function createMushroom(scale = 1, glow = false) {
  const group = new THREE.Group();
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 0.42 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0xead8b5, roughness: 0.9 }),
  );
  stem.position.y = 0.21 * scale;
  const capMaterial = new THREE.MeshStandardMaterial({
    color: glow ? 0xcfffb0 : 0xb77057,
    emissive: glow ? 0x7abf55 : 0x000000,
    emissiveIntensity: glow ? 1.4 : 0,
    roughness: 0.78,
  });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.25 * scale, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.55), capMaterial);
  cap.scale.y = 0.55;
  cap.position.y = 0.45 * scale;
  group.add(stem, cap);
  return group;
}

function createLantern() {
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

function createBench() {
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

function createChildInPyjamas() {
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
  const armGeometry = new THREE.CapsuleGeometry(0.09, 0.58, 4, 7);
  const leftArm = new THREE.Mesh(armGeometry, pyjamaLight);
  leftArm.position.set(-0.4, 1.37, 0);
  leftArm.rotation.z = 0.16;
  const rightArm = leftArm.clone();
  rightArm.position.x = 0.4;
  rightArm.rotation.z = -0.28;
  const legGeometry = new THREE.CapsuleGeometry(0.11, 0.58, 4, 7);
  const leftLeg = new THREE.Mesh(legGeometry, pyjamaLight);
  leftLeg.position.set(-0.17, 0.55, 0);
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.17;
  const slipperGeometry = new THREE.SphereGeometry(0.15, 8, 6);
  const leftSlipper = new THREE.Mesh(slipperGeometry, pyjama);
  leftSlipper.scale.set(1, 0.55, 1.35);
  leftSlipper.position.set(-0.17, 0.13, 0.08);
  const rightSlipper = leftSlipper.clone();
  rightSlipper.position.x = 0.17;
  child.add(head, hairCap, torso, leftArm, rightArm, leftLeg, rightLeg, leftSlipper, rightSlipper);
  child.scale.setScalar(0.88);
  return child;
}

function createLuma() {
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
  const glow = new THREE.PointLight(0xffd46e, 2.2, 3.2, 2);
  group.add(body, head, leftWing, rightWing, glow);
  return group;
}

function addForest(scene: THREE.Scene, stage: number) {
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
  mushroomPositions.slice(0, stage >= 2 ? 4 : stage >= 1 ? 2 : 1).forEach(([x, z], index) => {
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
        new THREE.MeshStandardMaterial({ color: index % 2 ? 0xe7d5ff : 0xbfe7c8, emissive: index % 2 ? 0x543873 : 0x315e46, emissiveIntensity: 0.45 }),
      );
      flower.position.set(-3.2 + index * 1.05, 0.11, 2.9 + Math.sin(index) * 0.35);
      forest.add(flower);
    }
  }

  scene.add(forest);
  return { forest, child, luma };
}

export function FireflyForestScene({ stage, reducedMotion }: FireflyForestSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof WebGLRenderingContext === 'undefined') return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.className = 'firefly-forest-three__canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.append(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071a1c);
    scene.fog = new THREE.FogExp2(0x071a1c, 0.055);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 4.3, 12.8);
    camera.lookAt(0, 1.7, 0.8);

    const hemisphere = new THREE.HemisphereLight(0x9cced2, 0x13271e, 1.25);
    const moon = new THREE.DirectionalLight(0xb7d7df, 1.1);
    moon.position.set(-4, 8, 6);
    const warmth = new THREE.PointLight(0xffc574, stage >= 3 ? 2.4 : 1.45, 14, 2);
    warmth.position.set(1, 4.5, 2.5);
    scene.add(hemisphere, moon, warmth);

    const { forest, child, luma } = addForest(scene, stage);
    const fireflies = createFireflies(stage === 0 ? 12 : stage === 1 ? 28 : stage === 2 ? 46 : 70, stage);
    scene.add(fireflies.points);

    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const bounds = container.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2,
        ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2,
      );
    };
    const onPointerLeave = () => pointerTarget.set(0, 0);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();
      pointerCurrent.lerp(pointerTarget, 0.055);
      camera.position.x = pointerCurrent.x * 0.52;
      camera.position.y = 4.3 - pointerCurrent.y * 0.24;
      camera.lookAt(pointerCurrent.x * 0.18, 1.7 - pointerCurrent.y * 0.08, 0.8);

      forest.children.forEach((object) => {
        if (typeof object.userData.swayPhase === 'number') {
          object.rotation.z = Math.sin(elapsed * 0.52 + object.userData.swayPhase) * 0.012;
        }
      });
      child.rotation.z = Math.sin(elapsed * 1.15) * 0.008;
      luma.position.y = 2.8 + Math.sin(elapsed * 1.8) * 0.16;
      luma.rotation.z = Math.sin(elapsed * 2.4) * 0.08;

      const positionAttribute = fireflies.points.geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = positionAttribute.array as Float32Array;
      for (let index = 0; index < fireflies.phases.length; index += 1) {
        const offset = index * 3;
        const phase = fireflies.phases[index];
        array[offset] = fireflies.basePositions[offset] + Math.sin(elapsed * 0.55 + phase) * 0.3;
        array[offset + 1] = fireflies.basePositions[offset + 1] + Math.sin(elapsed * 0.8 + phase * 1.3) * 0.22;
        array[offset + 2] = fireflies.basePositions[offset + 2] + Math.cos(elapsed * 0.48 + phase) * 0.24;
      }
      positionAttribute.needsUpdate = true;
      const pulse = 0.72 + Math.sin(elapsed * 2.1) * 0.18;
      fireflies.points.material.opacity = pulse;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(renderFrame);
    };

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      frame = window.requestAnimationFrame(renderFrame);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material instanceof THREE.PointsMaterial) material.map?.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion, stage]);

  return (
    <div ref={containerRef} className={`firefly-forest-three firefly-forest-three--stage-${stage}`} data-firefly-forest-three="true" aria-hidden="true">
      <div className="firefly-forest-three__fallback" />
    </div>
  );
}
