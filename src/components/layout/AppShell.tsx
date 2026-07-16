import type { ReactNode } from 'react';

interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell" data-theme="forest-fireflies">
      <header className="app-header">
        <div><p className="eyebrow">La Forêt des Lucioles</p><h1>Les Petites Quêtes</h1></div>
        <span className="foundation-badge">V1 familiale</span>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">Une aventure privée, locale et sans publicité.</footer>
    </div>
  );
}
