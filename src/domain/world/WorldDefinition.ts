import type { AgeBand } from '../shared/types';

export const WORLD_IDS = [
  'world.firefly-forest',
  'world.dragon-mountain',
  'world.space-station',
  'world.gnome-village',
  'world.nature-discovery',
  'world.creativity-workshop',
] as const;

export type WorldId = (typeof WORLD_IDS)[number];

export interface WorldDefinition {
  readonly id: WorldId;
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  readonly focus: string;
  readonly mascotId: string;
  readonly mascotName: string;
  readonly coverAssetId: string;
  readonly stageAssetIds: readonly [string, string, string, string];
  readonly version: string;
}

export interface AvatarDefinition {
  readonly id: string;
  readonly ageBand: AgeBand;
  readonly presentation: 'girl' | 'boy';
  readonly label: string;
  readonly assetId: string;
}

export function isWorldId(value: string): value is WorldId {
  return (WORLD_IDS as readonly string[]).includes(value);
}
