import { lazy, Suspense, type ComponentType } from 'react';
import { sceneRendererForWorld, type SceneRendererId } from '../../content/world/sceneRendererCatalog';
import { GenericParallaxScene } from './GenericParallaxScene';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const FireflyForestDiorama = lazy(() => import('./FireflyForestDiorama').then((module) => ({ default: module.FireflyForestDiorama })));
const GnomeVillageCampus = lazy(() => import('./GnomeVillageCampus').then((module) => ({ default: module.GnomeVillageCampus })));
const DragonMountainScene = lazy(() => import('./DragonMountainScene').then((module) => ({ default: module.DragonMountainScene })));

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

function LazyGnomeVillageCampus(props: WorldSceneRendererProps) {
  return <LazyScene loader={GnomeVillageCampus} {...props} />;
}

function LazyDragonMountainScene(props: WorldSceneRendererProps) {
  return <LazyScene loader={DragonMountainScene} {...props} />;
}

const renderers = {
  'generic-parallax': GenericParallaxScene,
  'firefly-diorama': LazyFireflyForestDiorama,
  'gnome-village-diorama': LazyGnomeVillageCampus,
  'dragon-mountain-rpg': LazyDragonMountainScene,
} satisfies Record<SceneRendererId, ComponentType<WorldSceneRendererProps>>;

export function ParallaxScene(props: WorldSceneRendererProps) {
  const Renderer = renderers[sceneRendererForWorld(props.world.id)];
  return <Renderer {...props} />;
}
