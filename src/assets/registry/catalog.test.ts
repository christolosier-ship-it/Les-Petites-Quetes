import { describe, expect, it } from 'vitest';
import { getAsset, getAssetUrl, listAssets } from './catalog';

describe('asset catalog', () => {
  it('retourne un asset connu et son URL publique', () => {
    expect(getAsset('brand.app-icon').type).toBe('icon');
    expect(getAssetUrl('brand.app-icon')).toContain('icons/icon.svg');
  });

  it('expose le catalogue complet', () => {
    expect(listAssets().map((asset) => asset.id)).toContain('world.forest-placeholder');
  });

  it('refuse un identifiant inconnu', () => {
    expect(() => getAsset('unknown.asset')).toThrow('Asset inconnu');
  });
});
