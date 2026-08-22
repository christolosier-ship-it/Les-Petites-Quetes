import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { animateLivingActors, createLivingAnimationState } from './fireflyForestAnimation';
import { addFireflyForestBackdrop, animateFireflyForestBackdrop } from './fireflyForestBackdrop';
import { FireflyForestIllustratedBackdrop } from './FireflyForestIllustratedBackdrop';
import { createFireflies } from './fireflyForestObjects';
import { addFireflyForest } from './fireflyForestWorld';

interface FireflyForestSceneProps {
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Points)) return;
    const geometry = object.geometry as THREE.BufferGeometry;
    const material = object.material as THREE.Material | THREE.Material[];
    geometry.dispose();
    const materials: THREE.Material[] = Array.isArray(material) ? material : [material];
    materials.forEach((entry) => {
      if (entry instanceof THREE.PointsMaterial) entry.map?.dispose();
      entry.dispose();
    });
  });
}

function updateIllustratedParallax(container: HTMLDivElement, x: number, y: number) {
  container.style.setProperty('--forest-x-far', `${x * -4}px`);
  container.style.setProperty('--forest-y-far', `${y * -2}px`);
  container.style.setProperty('--forest-x-mid', `${x * -9}px`);
  container.style.setProperty('--forest-y-mid', `${y * -4}px`);
  container.style.setProperty('--forest-x-near', `${x * -16}px`);
  container.style.setProperty('--forest-y-near', `${y * -7}px`);
}

export function FireflyForestScene({ stage, reducedMotion }: FireflyForestSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof WebGLRenderingContext === 'undefined') return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = stage >= 3 ? 1.16 : 1.06;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'firefly-forest-three__canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.append(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(stage >= 3 ? 0x0b2030 : 0x071a1c, stage >= 3 ? 0.042 : 0.052);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 85);
    camera.position.set(0, 4.3, 12.8);
    camera.lookAt(0, 1.7, 0.8);

    scene.add(new THREE.HemisphereLight(stage >= 3 ? 0xc7d9ff : 0x9cced2, 0x13271e, stage >= 3 ? 1.38 : 1.2));
    const moonlight = new THREE.DirectionalLight(0xb7d7df, stage >= 3 ? 1.28 : 1.02);
    moonlight.position.set(-4, 8, 6);
    const warmth = new THREE.PointLight(0xffc574, stage >= 3 ? 2.55 : 1.35, 14, 2);
    warmth.position.set(1, 4.5, 2.5);
    scene.add(moonlight, warmth);

    const backdrop = addFireflyForestBackdrop(scene, stage);
    const actors = addFireflyForest(scene, stage);
    const livingState = createLivingAnimationState();
    const fireflyCount = stage === 0 ? 12 : stage === 1 ? 28 : stage === 2 ? 46 : 86;
    const fireflies = createFireflies(fireflyCount, stage);
    scene.add(fireflies.points);

    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const bounds = container.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2,
        ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2,
      );
      updateIllustratedParallax(container, pointerTarget.x, pointerTarget.y);
    };
    const onPointerLeave = () => {
      pointerTarget.set(0, 0);
      updateIllustratedParallax(container, 0, 0);
    };
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
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      pointerCurrent.lerp(pointerTarget, 0.055);
      camera.position.set(pointerCurrent.x * 0.5, 4.3 - pointerCurrent.y * 0.22, 12.8);
      camera.lookAt(pointerCurrent.x * 0.16, 1.7 - pointerCurrent.y * 0.07, 0.8);
      actors.forest.children.forEach((object) => {
        if (typeof object.userData.swayPhase === 'number') object.rotation.z = Math.sin(elapsed * 0.52 + object.userData.swayPhase) * 0.012;
      });
      animateFireflyForestBackdrop(elapsed, backdrop, stage);
      animateLivingActors(elapsed, delta, actors, livingState, stage);
      const positionAttribute = fireflies.points.geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = positionAttribute.array as Float32Array;
      for (let index = 0; index < fireflies.phases.length; index += 1) {
        const offset = index * 3;
        const phase = fireflies.phases[index] ?? 0;
        const baseX = fireflies.basePositions[offset] ?? 0;
        const baseY = fireflies.basePositions[offset + 1] ?? 0;
        const baseZ = fireflies.basePositions[offset + 2] ?? 0;
        const dreamBoost = stage >= 3 ? 1.25 : 1;
        array[offset] = baseX + Math.sin(elapsed * 0.55 + phase) * 0.3 * dreamBoost;
        array[offset + 1] = baseY + Math.sin(elapsed * 0.8 + phase * 1.3) * 0.22 * dreamBoost;
        array[offset + 2] = baseZ + Math.cos(elapsed * 0.48 + phase) * 0.24 * dreamBoost;
      }
      positionAttribute.needsUpdate = true;
      fireflies.points.material.opacity = 0.72 + Math.sin(elapsed * 2.1) * 0.18;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(renderFrame);
    };

    if (!reducedMotion) frame = window.requestAnimationFrame(renderFrame);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      disposeScene(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion, stage]);

  return (
    <div ref={containerRef} className={`firefly-forest-three firefly-forest-three--stage-${stage}`} data-firefly-forest-three="true" aria-hidden="true">
      <FireflyForestIllustratedBackdrop stage={stage} reducedMotion={reducedMotion} />
      <div className="firefly-forest-three__fallback" />
    </div>
  );
}
