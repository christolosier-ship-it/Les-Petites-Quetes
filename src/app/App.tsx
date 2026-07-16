import { useReducer } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { OnboardingFlow } from '../features/onboarding/OnboardingFlow';
import { ChildHomePage } from '../pages/child/ChildHomePage';
import { ParentHomePage } from '../pages/parent/ParentHomePage';
import { WelcomePage } from '../pages/WelcomePage';
import { useFamilyApp } from './controller/useFamilyApp';
import { initialSessionState, sessionReducer } from './state/session';

export function App() {
  const [session, dispatch] = useReducer(sessionReducer, initialSessionState);
  const app = useFamilyApp();

  return (
    <AppShell reducedMotion={app.state.settings.reducedMotion}>
      {!app.ready && <section className="loading-page" aria-live="polite"><div className="loading-firefly">✦</div><h2>La forêt se réveille…</h2></section>}
      {app.ready && !app.state.settings.onboardingCompleted && (
        <OnboardingFlow app={app} onComplete={() => dispatch({ type: 'OPEN_CHILD_SPACE' })} />
      )}
      {app.ready && app.state.settings.onboardingCompleted && session.activeSpace === 'welcome' && (
        <WelcomePage app={app} onOpenChild={() => dispatch({ type: 'OPEN_CHILD_SPACE' })} onOpenParent={() => dispatch({ type: 'OPEN_PARENT_SPACE' })} />
      )}
      {app.ready && app.state.settings.onboardingCompleted && session.activeSpace === 'child' && (
        <ChildHomePage app={app} onBack={() => dispatch({ type: 'GO_HOME' })} />
      )}
      {app.ready && app.state.settings.onboardingCompleted && session.activeSpace === 'parent' && (
        <ParentHomePage app={app} onBack={() => dispatch({ type: 'GO_HOME' })} />
      )}
    </AppShell>
  );
}
