import { describe, expect, it } from 'vitest';
import { createEmptyFamilyState } from '../../application/model/FamilyState';
import { parseFamilyBackup, serializeFamilyBackup } from './familyBackup';

describe('sauvegarde familiale', () => {
  it('restaure un état équivalent après export', () => {
    const state = {
      ...createEmptyFamilyState(),
      settings: { ...createEmptyFamilyState().settings, parentPin: '1234' },
    };
    const restored = parseFamilyBackup(serializeFamilyBackup(state, '2026-07-16T10:00:00.000Z'));
    expect(restored.state).toEqual(state);
  });

  it('refuse un JSON étranger ou incomplet', () => {
    expect(() => parseFamilyBackup('{')).toThrow(/JSON valide/);
    expect(() => parseFamilyBackup('{"format":"autre"}')).toThrow(/Les Petites Quêtes/);
  });
});
