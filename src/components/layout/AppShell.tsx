import type { ReactNode } from 'react';
import { UpdateBanner } from '../../features/settings/UpdateBanner';

interface AppShellProps {
  readonly children: ReactNode;
  readonly reducedMotion: 'system' | 'reduce' | 'allow';
}

export function AppShell({ children, reducedMotion }: AppShellProps) {
  return (
    <div
      className="app-shell"
      data-theme="forest-fireflies"
      data-motion={reducedMotion}
    >
      <UpdateBanner />
      <main className="app-main">{children}</main>
    </div>
  );
}
