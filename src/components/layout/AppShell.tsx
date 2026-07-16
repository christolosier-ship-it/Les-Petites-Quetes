import type { ReactNode } from 'react';
import { appCopy } from '../../content/validation/appCopy';

interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell" data-theme="forest-fireflies">
      <header className="app-header">
        <div>
          <p className="eyebrow">La Forêt des Lucioles</p>
          <h1>{appCopy.appName}</h1>
        </div>
        <span className="foundation-badge">Fondation V1</span>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">{appCopy.tagline}</footer>
    </div>
  );
}
