import { describe, expect, it } from 'vitest';
import { appCopy, assertAppCopy } from './appCopy';

describe('assertAppCopy', () => {
  it('accepte le contenu fourni avec l’application', () => {
    expect(() => assertAppCopy(appCopy)).not.toThrow();
  });

  it('refuse une valeur qui n’est pas un objet', () => {
    expect(() => assertAppCopy(null)).toThrow('doit être un objet');
  });

  it('refuse une clé vide', () => {
    expect(() => assertAppCopy({ ...appCopy, appName: ' ' })).toThrow('appName');
  });
});
