import { lazy, Suspense, type ComponentType } from 'react';
import { sceneRendererForWorld, type SceneRendererId } from '../../content/world/sceneRendererCatalog';
import { GenericParallaxScene } from './GenericParallaxScene';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const BeyondFableForest = lazy(() => import('./BeyondFableForest').then((module) => ({ default: module.BeyondFableForest })));
const GnomeVillageCampus = lazy(() => import('./GnomeVillageCampus').then((module) => ({ default: module.GnomeVillageCampus })));
const DragonMountainGame = lazy(() => import('./DragonMountainGame').then((module) => ({ default: module.DragonMountainGame })));

function LazyScene({ loader: Renderer, ...props }: WorldSceneRendererProps & { readonly loader: ComponentType<WorldSceneRendererProps> }) {
  return (
    <Suspense fallback={<div className="parallax-scene parallax-scene--three" aria-busy="true" />}>
      <Renderer {...props} />
    </Suspense>
  );
}

function LazyBeyondFableForest(props: WorldSceneRendererProps) {
  return <LazyScene loader={BeyondFableForest} {...props} />;
}

function LazyGnomeVillageCampus(props: WorldSceneRendererProps) {
  return <LazyScene loader={GnomeVillageCampus} {...props} />;
}

function LazyDragonMountainGame(props: WorldSceneRendererProps) {
  return <LazyScene loader={DragonMountainGame} {...props} />;
}

const renderers = {
  'generic-parallax': GenericParallaxScene,
  'firefly-diorama': LazyBeyondFableForest,
  'gnome-village-diorama': LazyGnomeVillageCampus,
  'dragon-mountain-game': LazyDragonMountainGame,
} satisfies Record<SceneRendererId, ComponentType<WorldSceneRendererProps>>;

export function ParallaxScene(props: WorldSceneRendererProps) {
  const Renderer = renderers[sceneRendererForWorld(props.world.id)];
  return <Renderer {...props} />;
}
