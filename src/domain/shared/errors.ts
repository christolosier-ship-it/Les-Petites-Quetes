export type DomainErrorCode =
  | 'entity.invalid-id'
  | 'entity.invalid-timestamp'
  | 'child.display-name-required'
  | 'child.display-name-too-long'
  | 'child.invalid-age-band'
  | 'child.invalid-reading-level'
  | 'child.identifier-required'
  | 'child.archived-readonly'
  | 'child.deleted-readonly'
  | 'quest.title-required'
  | 'quest.title-too-long'
  | 'quest.instruction-required'
  | 'quest.instruction-too-long'
  | 'quest.invalid-category'
  | 'quest.identifier-required'
  | 'quest.age-band-required'
  | 'quest.age-band-duplicated'
  | 'quest.invalid-reading-level'
  | 'quest.invalid-duration'
  | 'quest.too-many-steps'
  | 'quest.step-id-duplicated'
  | 'quest.step-instruction-required'
  | 'quest.step-instruction-too-long'
  | 'quest.parent-note-too-long'
  | 'quest.content-version-required'
  | 'quest.builtin-readonly'
  | 'quest.archived-readonly'
  | 'quest.deleted-readonly'
  | 'validation.invalid-transition'
  | 'validation.adult-mode-required';

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly field?: string;

  constructor(code: DomainErrorCode, message: string, field?: string) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    if (field !== undefined) this.field = field;
  }
}

export function assertDomain(
  condition: unknown,
  code: DomainErrorCode,
  message: string,
  field?: string,
): asserts condition {
  if (!condition) throw new DomainError(code, message, field);
}
