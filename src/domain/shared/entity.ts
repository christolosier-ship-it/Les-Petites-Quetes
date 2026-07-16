export interface EntityMetadata {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: number;
  readonly deletedAt?: string;
}

export function incrementRevision(metadata: EntityMetadata, updatedAt: string): EntityMetadata {
  return {
    ...metadata,
    updatedAt,
    revision: metadata.revision + 1,
  };
}
