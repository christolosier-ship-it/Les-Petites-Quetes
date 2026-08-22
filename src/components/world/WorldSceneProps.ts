import type { WorldDefinition } from '../../domain/world/WorldDefinition';

export interface WorldSceneRendererProps {
  readonly world: WorldDefinition;
  readonly stage: 0 | 1 | 2 | 3;
  readonly reducedMotion: boolean;
  readonly compact?: boolean;
}
