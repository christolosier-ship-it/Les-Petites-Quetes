import { lazy, Suspense, type ComponentType } from 'react';
import { sceneRendererForWorld, type SceneRendererId } from '../../content/world/sceneRendererCatalog';
import { GenericParallaxScene } from './GenericParallaxScene';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const FireflyForestDiorama = lazy(() => import('./FireflyForestDiorama').then((module) => ({ default: module.FireflyForestDiorama })));
const GnomeVillageDiorama = lazy(() => import('./GnomeVillageDiorama').then((module) => ({ default: module.GnomeVillageDiorama })));

function LazyScene({ loader: Renderer, ...props }: WorldSceneRendererProps & { readonly loader: ComponentType<WorldSceneRendererProps> }) {
  return (
    <Suspense fallback={<div className="parallax-scene parallax-scene--three" aria-busy="true" />}>
      <Renderer {...props} />
    </Suspense>
  );
}

function LazyFireflyForestDiorama(props: WorldSceneRendererProps) {
  return <LazyScene loader={FireflyForestDiorama} {...props} />;
}

function LazyGnomeVillageDiorama(props: WorldSceneRendererProps) {
  return <LazyScene loader={GnomeVillageDiorama} {...props} />;
}

const renderers = {
  'generic-parallax': GenericParallaxScene,
  'firefly-diorama': LazyFireflyForestDiorama,
  'gnome-village-diorama': LazyGnomeVillageDiorama,
} satisfies Record<SceneRendererId, ComponentType<WorldSceneRendererProps>>;

export function ParallaxScene(props: WorldSceneRendererProps) {
  const Renderer = renderers[sceneRendererForWorld(props.world.id)];
  return <Renderer {...props} />;
}
