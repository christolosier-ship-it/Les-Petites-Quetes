import type { EntityMetadata } from '../../domain/shared/entity';

export function record(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} doit être un objet.`);
  }
  return value as Record<string, unknown>;
}

export function list(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new Error(`${label} doit être une liste.`);
  return value;
}

export function text(source: Record<string, unknown>, key: string, label = key): string {
  const value = source[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} doit être un texte non vide.`);
  }
  return value;
}

export function optionalText(source: Record<string, unknown>, key: string): string | undefined {
  const value = source[key];
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${key} doit être un texte non vide lorsqu’il est présent.`);
  }
  return value;
}

export function boolean(source: Record<string, unknown>, key: string): boolean {
  const value = source[key];
  if (typeof value !== 'boolean') throw new Error(`${key} doit être un booléen.`);
  return value;
}

export function integer(source: Record<string, unknown>, key: string, minimum = 0): number {
  const value = source[key];
  if (!Number.isInteger(value) || Number(value) < minimum) {
    throw new Error(`${key} doit être un entier supérieur ou égal à ${minimum}.`);
  }
  return Number(value);
}

export function optionalInteger(
  source: Record<string, unknown>,
  key: string,
  minimum = 0,
): number | undefined {
  if (source[key] === undefined) return undefined;
  return integer(source, key, minimum);
}

export function oneOf<T extends string>(
  source: Record<string, unknown>,
  key: string,
  values: readonly T[],
): T {
  const value = source[key];
  if (typeof value !== 'string' || !values.includes(value as T)) {
    throw new Error(`${key} contient une valeur inconnue.`);
  }
  return value as T;
}

export function stringList(source: Record<string, unknown>, key: string): readonly string[] {
  const values = list(source[key], key);
  if (values.some((value) => typeof value !== 'string' || value.trim().length === 0)) {
    throw new Error(`${key} doit contenir uniquement des identifiants valides.`);
  }
  const normalized = values as readonly string[];
  if (new Set(normalized).size !== normalized.length) {
    throw new Error(`${key} contient des doublons.`);
  }
  return normalized;
}

export function metadata(source: Record<string, unknown>): EntityMetadata {
  const createdAt = text(source, 'createdAt');
  const updatedAt = text(source, 'updatedAt');
  const deletedAt = optionalText(source, 'deletedAt');
  return {
    id: text(source, 'id'),
    createdAt,
    updatedAt,
    revision: integer(source, 'revision', 1),
    ...(deletedAt !== undefined ? { deletedAt } : {}),
  };
}

export function assertUniqueIds(items: readonly EntityMetadata[], label: string): void {
  const ids = items.map((item) => item.id);
  if (new Set(ids).size !== ids.length) throw new Error(`${label} contient des identifiants dupliqués.`);
}
