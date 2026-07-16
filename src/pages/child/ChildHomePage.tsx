import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { TabBar } from '../../components/layout/TabBar';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { ChildQuestList } from '../../features/daily-quests/ChildQuestList';
import { RewardCelebration } from '../../features/storybook/RewardCelebration';
import { TreasurePanel } from '../../features/storybook/TreasurePanel';
import { WorldView } from '../../features/world-progression/WorldView';

interface ChildHomePageProps {
  readonly app: FamilyAppController;
  readonly onBack: () => void;
}

type ChildTab = 'world' | 'quests' | 'treasure';
const tabs = [
  { id: 'world', label: 'Mon monde', icon: '🌳' },
  { id: 'quests', label: 'Mes quêtes', icon: '✨' },
  { id: 'treasure', label: 'Mon trésor', icon: '🎒' },
] as const;

export function ChildHomePage({ app, onBack }: ChildHomePageProps) {
  const [tab, setTab] = useState<ChildTab>('world');
  const children = app.state.children.filter((child) => !child.isArchived && child.deletedAt === undefined);
  const activeChildId = children.find((child) => child.id === app.state.settings.activeChildId)?.id ?? children[0]?.id;

  if (activeChildId === undefined) {
    return <section className="centered-panel" data-page="child"><Card className="empty-card"><div aria-hidden="true">🌱</div><h2>La forêt attend son explorateur</h2><p>Un adulte doit d’abord créer un profil dans l’espace parent.</p><Button onClick={onBack}>Revenir à l’accueil</Button></Card></section>;
  }

  const activeChild = children.find((child) => child.id === activeChildId)!;
  return (
    <section className="workspace workspace--child" data-page="child" data-age-band={activeChild.ageBand}>
      <header className="workspace-header child-header">
        <div><p className="eyebrow">Bonjour {activeChild.displayName}</p><h2>La Forêt des Lucioles</h2></div>
        <Button variant="quiet" onClick={onBack}>Accueil</Button>
      </header>
      {children.length > 1 && <div className="profile-picker" aria-label="Choisir un profil">{children.map((child) => <button key={child.id} type="button" className={child.id === activeChildId ? 'profile-chip profile-chip--active' : 'profile-chip'} onClick={() => void app.selectChild(child.id)}>{child.avatarId === 'avatar.fox' ? '🦊' : child.avatarId === 'avatar.owl' ? '🦉' : child.avatarId === 'avatar.hedgehog' ? '🦔' : '✨'} {child.displayName}</button>)}</div>}
      <RewardCelebration app={app} childId={activeChildId} onViewWorld={() => setTab('world')} />
      <TabBar tabs={tabs} active={tab} onChange={setTab} label="Navigation enfant" />
      <div className="workspace-content">
        {tab === 'world' && <WorldView app={app} childId={activeChildId} compact />}
        {tab === 'quests' && <ChildQuestList app={app} childId={activeChildId} />}
        {tab === 'treasure' && <TreasurePanel app={app} childId={activeChildId} />}
      </div>
    </section>
  );
}
