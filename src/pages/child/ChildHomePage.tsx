import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { findAvatarDefinition } from '../../content/avatars/avatarCatalog';
import type { WorldId } from '../../domain/world/WorldDefinition';
import { RewardCelebration } from '../../features/storybook/RewardCelebration';
import { WorldHub } from '../../features/world-hub/WorldHub';
import { ChildWorldSpace } from './ChildWorldSpace';

interface ChildHomePageProps {
  readonly app: FamilyAppController;
  readonly onBack: () => void;
}

export function ChildHomePage({ app, onBack }: ChildHomePageProps) {
  const children = app.state.children.filter((child) => !child.isArchived && child.deletedAt === undefined);
  const activeChildId = children.find((child) => child.id === app.state.settings.activeChildId)?.id ?? children[0]?.id;
  const [worldId, setWorldId] = useState<WorldId>();

  if (activeChildId === undefined) {
    return <section className="centered-panel" data-page="child"><Card className="empty-card"><div aria-hidden="true">🌱</div><h2>Les univers attendent leur explorateur</h2><p>Un adulte doit d’abord créer un profil dans l’espace parent.</p><Button onClick={onBack}>Revenir à l’accueil</Button></Card></section>;
  }

  const activeChild = children.find((child) => child.id === activeChildId)!;
  return (
    <section className="workspace workspace--child" data-page="child" data-age-band={activeChild.ageBand}>
      {worldId === undefined && <header className="workspace-header child-header"><div><p className="eyebrow">Espace enfant</p><h1>Les Petites Quêtes</h1></div><Button variant="quiet" onClick={onBack}>Accueil</Button></header>}
      {children.length > 1 && <div className="profile-picker" aria-label="Choisir un profil">{children.map((child) => { const avatar = findAvatarDefinition(child.avatarId); return <button key={child.id} type="button" className={child.id === activeChildId ? 'profile-chip profile-chip--active' : 'profile-chip'} onClick={() => { setWorldId(undefined); void app.selectChild(child.id); }}><span aria-hidden="true">{avatar?.presentation === 'girl' ? '👧' : '👦'}</span> {child.displayName}</button>; })}</div>}
      <RewardCelebration app={app} childId={activeChildId} onViewWorld={setWorldId} />
      {worldId === undefined
        ? <WorldHub app={app} childId={activeChildId} onOpenWorld={setWorldId} />
        : <ChildWorldSpace app={app} childId={activeChildId} worldId={worldId} onBack={() => setWorldId(undefined)} onHome={onBack} />}
    </section>
  );
}
