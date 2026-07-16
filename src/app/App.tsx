import { useReducer } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { ChildHomePage } from '../pages/child/ChildHomePage';
import { ParentHomePage } from '../pages/parent/ParentHomePage';
import { WelcomePage } from '../pages/WelcomePage';
import { initialSessionState, sessionReducer } from './state/session';

export function App() {
  const [session, dispatch] = useReducer(sessionReducer, initialSessionState);

  return (
    <AppShell>
      {session.activeSpace === 'welcome' && (
        <WelcomePage
          onOpenChild={() => dispatch({ type: 'OPEN_CHILD_SPACE' })}
          onOpenParent={() => dispatch({ type: 'OPEN_PARENT_SPACE' })}
        />
      )}
      {session.activeSpace === 'child' && (
        <ChildHomePage onBack={() => dispatch({ type: 'GO_HOME' })} />
      )}
      {session.activeSpace === 'parent' && (
        <ParentHomePage onBack={() => dispatch({ type: 'GO_HOME' })} />
      )}
    </AppShell>
  );
}
