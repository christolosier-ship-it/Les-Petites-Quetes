import { createEntityMetadata, incrementRevision, type EntityMetadata } from '../shared/entity';
import { assertDomain } from '../shared/errors';
import {
  AGE_BANDS,
  READING_LEVELS,
  belongsTo,
  type AgeBand,
  type ReadingLevel,
} from '../shared/types';
import { requireIdentifier, requireText } from '../shared/validation';

const DISPLAY_NAME_MAX_LENGTH = 30;

export interface ChildProfile extends EntityMetadata {
  readonly displayName: string;
  readonly ageBand: AgeBand;
  readonly readingLevel: ReadingLevel;
  readonly avatarId: string;
  readonly accentId: string;
  readonly activeWorldId: string;
  readonly isArchived: boolean;
}

export interface ChildProfileInput {
  readonly displayName: string;
  readonly ageBand: AgeBand;
  readonly readingLevel: ReadingLevel;
  readonly avatarId: string;
  readonly accentId: string;
  readonly activeWorldId: string;
}

export type ChildProfileChanges = Partial<ChildProfileInput>;

function normalizeInput(input: ChildProfileInput): ChildProfileInput {
  const displayName = requireText(
    input.displayName,
    'child.display-name-required',
    'Un prénom ou pseudonyme est requis.',
    'displayName',
  );
  assertDomain(
    displayName.length <= DISPLAY_NAME_MAX_LENGTH,
    'child.display-name-too-long',
    `Le prénom ou pseudonyme ne peut pas dépasser ${DISPLAY_NAME_MAX_LENGTH} caractères.`,
    'displayName',
  );
  assertDomain(
    belongsTo(input.ageBand, AGE_BANDS),
    'child.invalid-age-band',
    'La tranche d’âge du profil est inconnue.',
    'ageBand',
  );
  assertDomain(
    belongsTo(input.readingLevel, READING_LEVELS),
    'child.invalid-reading-level',
    'Le niveau de lecture du profil est inconnu.',
    'readingLevel',
  );

  return {
    displayName,
    ageBand: input.ageBand,
    readingLevel: input.readingLevel,
    avatarId: requireIdentifier(
      input.avatarId,
      'child.identifier-required',
      'Un avatar est requis.',
      'avatarId',
    ),
    accentId: requireIdentifier(
      input.accentId,
      'child.identifier-required',
      'Une couleur est requise.',
      'accentId',
    ),
    activeWorldId: requireIdentifier(
      input.activeWorldId,
      'child.identifier-required',
      'Un univers actif est requis.',
      'activeWorldId',
    ),
  };
}

function assertEditable(profile: ChildProfile): void {
  assertDomain(
    profile.deletedAt === undefined,
    'child.deleted-readonly',
    'Un profil supprimé ne peut plus être modifié.',
  );
  assertDomain(
    !profile.isArchived,
    'child.archived-readonly',
    'Restaurez le profil avant de le modifier.',
  );
}

export function createChildProfile(
  input: ChildProfileInput,
  identity: { readonly id: string; readonly createdAt: string },
): ChildProfile {
  return {
    ...createEntityMetadata(identity.id, identity.createdAt),
    ...normalizeInput(input),
    isArchived: false,
  };
}

export function updateChildProfile(
  profile: ChildProfile,
  changes: ChildProfileChanges,
  updatedAt: string,
): ChildProfile {
  assertEditable(profile);
  const normalized = normalizeInput({
    displayName: changes.displayName ?? profile.displayName,
    ageBand: changes.ageBand ?? profile.ageBand,
    readingLevel: changes.readingLevel ?? profile.readingLevel,
    avatarId: changes.avatarId ?? profile.avatarId,
    accentId: changes.accentId ?? profile.accentId,
    activeWorldId: changes.activeWorldId ?? profile.activeWorldId,
  });

  return {
    ...profile,
    ...normalized,
    ...incrementRevision(profile, updatedAt),
  };
}

export function archiveChildProfile(profile: ChildProfile, updatedAt: string): ChildProfile {
  if (profile.isArchived) return profile;
  assertDomain(
    profile.deletedAt === undefined,
    'child.deleted-readonly',
    'Un profil supprimé ne peut plus être archivé.',
  );

  return {
    ...profile,
    isArchived: true,
    ...incrementRevision(profile, updatedAt),
  };
}

export function restoreChildProfile(profile: ChildProfile, updatedAt: string): ChildProfile {
  if (!profile.isArchived) return profile;
  assertDomain(
    profile.deletedAt === undefined,
    'child.deleted-readonly',
    'Un profil supprimé ne peut pas être restauré.',
  );

  return {
    ...profile,
    isArchived: false,
    ...incrementRevision(profile, updatedAt),
  };
}
