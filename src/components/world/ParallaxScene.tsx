import type { ComponentType } from 'react';
import { sceneRendererForWorld, type SceneRendererId } from '../../content/world/sceneRendererCatalog';
import { FireflyForestDiorama } from './FireflyForestDiorama';
import { GenericParallaxScene } from './GenericParallaxScene';
import type { WorldSceneRendererProps } from './WorldSceneProps';

const renderers = {
  'generic-parallax': GenericParallaxScene,
  'firefly-diorama': FireflyForestDiorama,
} satisfies Record<SceneRendererId, ComponentType<WorldSceneRendererProps>>;

export function ParallaxScene(props: WorldSceneRendererProps) {
  const Renderer = renderers[sceneRendererForWorld(props.world.id)];
  return <Renderer {...props} />;
}
