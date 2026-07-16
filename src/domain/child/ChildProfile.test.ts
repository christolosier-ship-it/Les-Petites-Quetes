import { describe, expect, it } from 'vitest';
import { DomainError, type DomainErrorCode } from '../shared/errors';
import type { AgeBand } from '../shared/types';
import { archiveChildProfile, createChildProfile, restoreChildProfile, updateChildProfile, type ChildProfileInput } from './ChildProfile';

const input: ChildProfileInput = { displayName: '  Maddie  ', ageBand: '3-5', readingLevel: 'visual', avatarId: 'avatar.girl.3-5' };
function createProfile() { return createChildProfile(input, { id: 'child-1', createdAt: '2026-07-16T08:00:00.000Z' }); }
function expectDomainError(run: () => unknown, code: DomainErrorCode): void {
  try { run(); } catch (error) { expect(error).toBeInstanceOf(DomainError); if (error instanceof DomainError) expect(error.code).toBe(code); return; }
  throw new Error(`L’erreur métier ${code} était attendue.`);
}

describe('ChildProfile', () => {
  it('crée un profil minimal sans date de naissance, compagnon ou couleur', () => {
    expect(createProfile()).toEqual({ id: 'child-1', createdAt: '2026-07-16T08:00:00.000Z', updatedAt: '2026-07-16T08:00:00.000Z', revision: 1, displayName: 'Maddie', ageBand: '3-5', readingLevel: 'visual', avatarId: 'avatar.girl.3-5', isArchived: false });
  });
  it('refuse un prénom vide ou excessivement long', () => {
    expectDomainError(() => createChildProfile({ ...input, displayName: '   ' }, { id: 'child-2', createdAt: 'now' }), 'child.display-name-required');
    expectDomainError(() => createChildProfile({ ...input, displayName: 'x'.repeat(31) }, { id: 'child-3', createdAt: 'now' }), 'child.display-name-too-long');
  });
  it('refuse une tranche d’âge inconnue même si une donnée importée contourne TypeScript', () => {
    expectDomainError(() => createChildProfile({ ...input, ageBand: '11-13' as AgeBand }, { id: 'child-4', createdAt: 'now' }), 'child.invalid-age-band');
  });
  it('met à jour le profil de manière immuable et révisionnée', () => {
    const original = createProfile();
    const updated = updateChildProfile(original, { displayName: 'Maddie l’exploratrice', readingLevel: 'short-text' }, '2026-07-16T09:00:00.000Z');
    expect(original.displayName).toBe('Maddie');
    expect(updated).toMatchObject({ displayName: 'Maddie l’exploratrice', readingLevel: 'short-text', revision: 2 });
  });
  it('archive de façon idempotente puis exige une restauration avant modification', () => {
    const archived = archiveChildProfile(createProfile(), '2026-07-16T09:00:00.000Z');
    expect(archiveChildProfile(archived, '2026-07-16T10:00:00.000Z')).toBe(archived);
    expectDomainError(() => updateChildProfile(archived, { displayName: 'Nouveau nom' }, 'later'), 'child.archived-readonly');
    const restored = restoreChildProfile(archived, '2026-07-16T10:00:00.000Z');
    expect(restored).toMatchObject({ isArchived: false, revision: 3 });
  });
});
