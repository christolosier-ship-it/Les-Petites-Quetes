import { useEffect, useRef } from 'react';
import * as THREE from 'three';
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

    scene.add(new THREE.HemisphereLight(0x9cced2, 0x13271e, 1.25));
    const moon = new THREE.DirectionalLight(0xb7d7df, 1.1);
    moon.position.set(-4, 8, 6);
    const warmth = new THREE.PointLight(0xffc574, stage >= 3 ? 2.4 : 1.45, 14, 2);
    warmth.position.set(1, 4.5, 2.5);
    scene.add(moon, warmth);

    const { forest, child, luma } = addFireflyForest(scene, stage);
    const fireflyCount = stage === 0 ? 12 : stage === 1 ? 28 : stage === 2 ? 46 : 70;
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
      camera.position.set(pointerCurrent.x * 0.52, 4.3 - pointerCurrent.y * 0.24, 12.8);
      camera.lookAt(pointerCurrent.x * 0.18, 1.7 - pointerCurrent.y * 0.08, 0.8);
      forest.children.forEach((object) => {
        if (typeof object.userData.swayPhase === 'number') object.rotation.z = Math.sin(elapsed * 0.52 + object.userData.swayPhase) * 0.012;
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

  return <div ref={containerRef} className={`firefly-forest-three firefly-forest-three--stage-${stage}`} data-firefly-forest-three="true" aria-hidden="true"><div className="firefly-forest-three__fallback" /></div>;
}
