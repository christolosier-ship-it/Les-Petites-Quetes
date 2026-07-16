import { describe, expect, it } from 'vitest';
import { createEmptyFamilyState } from '../../application/model/FamilyState';
import { migrateFamilyState } from './migrateFamilyState';

describe('migration de l’état familial', () => {
  it('initialise un premier lancement vide', () => {
    expect(migrateFamilyState(undefined)).toEqual(createEmptyFamilyState());
  });

  it('restaure un état V1 complet', () => {
    const source = {
      ...createEmptyFamilyState(),
      settings: {
        ...createEmptyFamilyState().settings,
        parentPin: '1234',
        activeChildId: 'child-1',
      },
    };
    expect(migrateFamilyState(source).settings.activeChildId).toBe('child-1');
  });

  it('refuse une version inconnue sans modifier les données', () => {
    expect(() =>
      migrateFamilyState({
        ...createEmptyFamilyState(),
        settings: { ...createEmptyFamilyState().settings, schemaVersion: 99 },
      }),
    ).toThrow(/Version de schéma/);
  });

  it('refuse une collection ou des réglages invalides', () => {
    expect(() => migrateFamilyState([])).toThrow();
    expect(() =>
      migrateFamilyState({
        ...createEmptyFamilyState(),
        children: 'non',
      }),
    ).toThrow(/children/);
  });
});
