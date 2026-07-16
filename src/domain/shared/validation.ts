import { assertDomain, type DomainErrorCode } from './errors';

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function requireText(
  value: string,
  code: DomainErrorCode,
  message: string,
  field: string,
): string {
  const normalized = normalizeWhitespace(value);
  assertDomain(normalized.length > 0, code, message, field);
  return normalized;
}

export function requireIdentifier(
  value: string,
  code: DomainErrorCode,
  message: string,
  field: string,
): string {
  const normalized = value.trim();
  assertDomain(normalized.length > 0, code, message, field);
  assertDomain(!/\s/.test(normalized), code, message, field);
  return normalized;
}

export function wordCount(value: string): number {
  const normalized = normalizeWhitespace(value);
  return normalized.length === 0 ? 0 : normalized.split(' ').length;
}

export function hasDuplicates<T>(values: readonly T[]): boolean {
  return new Set(values).size !== values.length;
}
