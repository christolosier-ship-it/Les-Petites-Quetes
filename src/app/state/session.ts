export type AppSpace = 'welcome' | 'child' | 'parent';

export interface SessionState {
  readonly activeSpace: AppSpace;
}

export type SessionAction =
  | { readonly type: 'OPEN_CHILD_SPACE' }
  | { readonly type: 'OPEN_PARENT_SPACE' }
  | { readonly type: 'GO_HOME' };

export const initialSessionState: SessionState = {
  activeSpace: 'welcome',
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'OPEN_CHILD_SPACE':
      return { ...state, activeSpace: 'child' };
    case 'OPEN_PARENT_SPACE':
      return { ...state, activeSpace: 'parent' };
    case 'GO_HOME':
      return { ...state, activeSpace: 'welcome' };
  }
}
