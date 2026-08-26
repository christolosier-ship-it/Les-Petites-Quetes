import type { WorldId } from '../../domain/world/WorldDefinition';

export type SceneRendererId = 'generic-parallax' | 'firefly-diorama' | 'vroom-scadoodles-game' | 'dragon-mountain-game';

const sceneRendererOverrides: Partial<Record<WorldId, SceneRendererId>> = {
  'world.firefly-forest': 'firefly-diorama',
  'world.gnome-village': 'vroom-scadoodles-game',
  'world.dragon-mountain': 'dragon-mountain-game',
};

export function sceneRendererForWorld(worldId: WorldId): SceneRendererId {
  return sceneRendererOverrides[worldId] ?? 'generic-parallax';
}
