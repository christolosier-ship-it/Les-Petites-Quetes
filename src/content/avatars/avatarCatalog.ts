import type { AgeBand } from '../../domain/shared/types';
import type { AvatarDefinition } from '../../domain/world/WorldDefinition';

export const avatarCatalog: readonly AvatarDefinition[] = [
  { id: 'avatar.girl.3-5', ageBand: '3-5', presentation: 'girl', label: 'Fille, 3 à 5 ans', assetId: 'avatar.girl.3-5' },
  { id: 'avatar.boy.3-5', ageBand: '3-5', presentation: 'boy', label: 'Garçon, 3 à 5 ans', assetId: 'avatar.boy.3-5' },
  { id: 'avatar.girl.6-8', ageBand: '6-8', presentation: 'girl', label: 'Fille, 6 à 8 ans', assetId: 'avatar.girl.6-8' },
  { id: 'avatar.boy.6-8', ageBand: '6-8', presentation: 'boy', label: 'Garçon, 6 à 8 ans', assetId: 'avatar.boy.6-8' },
  { id: 'avatar.girl.9-10', ageBand: '9-10', presentation: 'girl', label: 'Fille, 9 à 10 ans', assetId: 'avatar.girl.9-10' },
  { id: 'avatar.boy.9-10', ageBand: '9-10', presentation: 'boy', label: 'Garçon, 9 à 10 ans', assetId: 'avatar.boy.9-10' },
];

export function avatarsForAgeBand(ageBand: AgeBand): readonly AvatarDefinition[] {
  return avatarCatalog.filter((avatar) => avatar.ageBand === ageBand);
}

export function findAvatarDefinition(id: string): AvatarDefinition | undefined {
  return avatarCatalog.find((avatar) => avatar.id === id);
}

export function isAvatarAllowedForAge(id: string, ageBand: AgeBand): boolean {
  return findAvatarDefinition(id)?.ageBand === ageBand;
}

export function defaultAvatarForAge(ageBand: AgeBand): string {
  return avatarsForAgeBand(ageBand)[0]!.id;
}
