import { assertDomain } from './errors';
import { requireIdentifier } from './validation';

export interface EntityMetadata {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: number;
  readonly deletedAt?: string;
}

export function createEntityMetadata(id: string, createdAt: string): EntityMetadata {
  const normalizedId = requireIdentifier(
    id,
    'entity.invalid-id',
    'Un identifiant d’entité est requis.',
    'id',
  );
  const normalizedTimestamp = createdAt.trim();
  assertDomain(
    normalizedTimestamp.length > 0,
    'entity.invalid-timestamp',
    'Un instant technique est requis.',
    'createdAt',
  );

  return {
    id: normalizedId,
    createdAt: normalizedTimestamp,
    updatedAt: normalizedTimestamp,
    revision: 1,
  };
}

export function incrementRevision(metadata: EntityMetadata, updatedAt: string): EntityMetadata {
  const normalizedTimestamp = updatedAt.trim();
  assertDomain(
    normalizedTimestamp.length > 0,
    'entity.invalid-timestamp',
    'Un instant technique est requis.',
    'updatedAt',
  );

  return {
    id: metadata.id,
    createdAt: metadata.createdAt,
    updatedAt: normalizedTimestamp,
    revision: metadata.revision + 1,
    ...(metadata.deletedAt !== undefined ? { deletedAt: metadata.deletedAt } : {}),
  };
}
