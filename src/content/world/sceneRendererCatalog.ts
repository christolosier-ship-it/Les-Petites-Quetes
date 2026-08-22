import type { WorldId } from '../../domain/world/WorldDefinition';

export type SceneRendererId = 'generic-parallax' | 'firefly-diorama';

const sceneRendererOverrides: Partial<Record<WorldId, SceneRendererId>> = {
  'world.firefly-forest': 'firefly-diorama',
};

export function sceneRendererForWorld(worldId: WorldId): SceneRendererId {
  return sceneRendererOverrides[worldId] ?? 'generic-parallax';
}
