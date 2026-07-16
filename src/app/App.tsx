import { useReducer } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { ChildHomePage } from '../pages/child/ChildHomePage';
import { ParentHomePage } from '../pages/parent/ParentHomePage';
import { WelcomePage } from '../pages/WelcomePage';
import { useFamilyApp } from './controller/useFamilyApp';
import { initialSessionState, sessionReducer } from './state/session';

export function App() {
  const [session, dispatch] = useReducer(sessionReducer, initialSessionState);
  const app = useFamilyApp();

  return (
    <AppShell>
      {!app.ready && <section className="loading-page" aria-live="polite"><div className="loading-firefly">✦</div><h2>La forêt se réveille…</h2></section>}
      {app.ready && session.activeSpace === 'welcome' && (
        <WelcomePage app={app} onOpenChild={() => dispatch({ type: 'OPEN_CHILD_SPACE' })} onOpenParent={() => dispatch({ type: 'OPEN_PARENT_SPACE' })} />
      )}
      {app.ready && session.activeSpace === 'child' && (
        <ChildHomePage app={app} onBack={() => dispatch({ type: 'GO_HOME' })} />
      )}
      {app.ready && session.activeSpace === 'parent' && (
        <ParentHomePage app={app} onBack={() => dispatch({ type: 'GO_HOME' })} />
      )}
    </AppShell>
  );
}
