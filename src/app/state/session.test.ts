import { describe, expect, it } from 'vitest';
import { initialSessionState, sessionReducer } from './session';

describe('sessionReducer', () => {
  it('ouvre l’espace enfant', () => {
    expect(sessionReducer(initialSessionState, { type: 'OPEN_CHILD_SPACE' })).toEqual({
      activeSpace: 'child',
    });
  });

  it('ouvre l’espace parent', () => {
    expect(sessionReducer(initialSessionState, { type: 'OPEN_PARENT_SPACE' })).toEqual({
      activeSpace: 'parent',
    });
  });

  it('revient à l’accueil', () => {
    expect(sessionReducer({ activeSpace: 'child' }, { type: 'GO_HOME' })).toEqual({
      activeSpace: 'welcome',
    });
  });
});
