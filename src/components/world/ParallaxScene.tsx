import { lazy, Suspense, type ComponentType } from 'react';
import { sceneRendererForWorld, type SceneRendererId } from '../../content/world/sceneRendererCatalog';
import { GenericParallaxScene } from './GenericParallaxScene';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const FireflyForestDiorama = lazy(() => import('./FireflyForestDiorama').then((module) => ({ default: module.FireflyForestDiorama })));

function LazyFireflyForestDiorama(props: WorldSceneRendererProps) {
  return (
    <Suspense fallback={<div className="parallax-scene parallax-scene--three" aria-busy="true" />}>
      <FireflyForestDiorama {...props} />
    </Suspense>
  );
}

const renderers = {
  'generic-parallax': GenericParallaxScene,
  'firefly-diorama': LazyFireflyForestDiorama,
} satisfies Record<SceneRendererId, ComponentType<WorldSceneRendererProps>>;

export function ParallaxScene(props: WorldSceneRendererProps) {
  const Renderer = renderers[sceneRendererForWorld(props.world.id)];
  return <Renderer {...props} />;
}
