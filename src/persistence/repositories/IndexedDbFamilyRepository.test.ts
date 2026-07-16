import { beforeEach, describe, expect, it } from 'vitest';
import { createEmptyFamilyState } from '../../application/model/FamilyState';
import { IndexedDbFamilyRepository } from './IndexedDbFamilyRepository';

const repository = new IndexedDbFamilyRepository();

beforeEach(async () => {
  await repository.clear();
});

describe('IndexedDbFamilyRepository sans IndexedDB', () => {
  it('remplace un état et conserve une sauvegarde restaurable', async () => {
    const initial = createEmptyFamilyState();
    const changed = {
      ...initial,
      settings: { ...initial.settings, soundEnabled: false },
    };

    await repository.save(initial);
    await repository.replaceWithBackup(initial, changed, 'before-import', '2026-07-16T12:00:00.000Z');
    expect((await repository.load()).settings.soundEnabled).toBe(false);

    const backups = await repository.listBackups();
    expect(backups).toHaveLength(1);
    expect(backups[0]?.reason).toBe('before-import');

    const restored = await repository.restoreBackup(
      backups[0]!.key,
      '2026-07-16T12:01:00.000Z',
    );
    expect(restored.settings.soundEnabled).toBe(true);
    expect(await repository.listBackups()).toHaveLength(2);
  });

  it('refuse de sauvegarder un état invalide', async () => {
    await expect(repository.save({
      ...createEmptyFamilyState(),
      acknowledgedRewardGrantIds: ['grant-absent'],
    })).rejects.toThrow(/récompense inconnue/);
  });
});
