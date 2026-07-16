import type { WorldId } from '../../domain/world/WorldDefinition';

export interface ParallaxLayerDefinition {
  readonly id: string;
  readonly depth: number;
  readonly kind: 'image' | 'glow' | 'particles';
  readonly assetId?: string;
  readonly minimumStage: 0 | 1 | 2 | 3;
}

export interface ParallaxSceneDefinition {
  readonly worldId: WorldId;
  readonly layers: readonly ParallaxLayerDefinition[];
}

export function createSceneDefinition(worldId: WorldId, stageAssetIds: readonly string[]): ParallaxSceneDefinition {
  return {
    worldId,
    layers: [
      { id: 'backdrop', depth: 0.08, kind: 'image', assetId: stageAssetIds[0], minimumStage: 0 },
      { id: 'atmosphere', depth: 0.18, kind: 'glow', minimumStage: 1 },
      { id: 'world', depth: 0.3, kind: 'image', assetId: stageAssetIds[1], minimumStage: 1 },
      { id: 'discoveries', depth: 0.48, kind: 'image', assetId: stageAssetIds[2], minimumStage: 2 },
      { id: 'foreground', depth: 0.7, kind: 'image', assetId: stageAssetIds[3], minimumStage: 3 },
      { id: 'particles', depth: 0.9, kind: 'particles', minimumStage: 1 },
    ],
  };
}
