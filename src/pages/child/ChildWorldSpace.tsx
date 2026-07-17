import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { TabBar } from '../../components/layout/TabBar';
import { Button } from '../../components/primitives/Button';
import { findWorldDefinition } from '../../content/world/worldCatalog';
import type { WorldId } from '../../domain/world/WorldDefinition';
import { ChildQuestList } from '../../features/daily-quests/ChildQuestList';
import { TreasurePanel } from '../../features/storybook/TreasurePanel';
import { WorldView } from '../../features/world-progression/WorldView';

interface ChildWorldSpaceProps {
  readonly app: FamilyAppController;
  readonly childId: string;
  readonly worldId: WorldId;
  readonly onBack: () => void;
  readonly onHome: () => void;
}

type ChildTab = 'world' | 'quests' | 'treasure';
const tabs = [
  { id: 'world', label: 'Mon univers', icon: '🌍' },
  { id: 'quests', label: 'Mes quêtes', icon: '✨' },
  { id: 'treasure', label: 'Mon trésor', icon: '🎒' },
] as const;

export function ChildWorldSpace({ app, childId, worldId, onBack, onHome }: ChildWorldSpaceProps) {
  const [tab, setTab] = useState<ChildTab>('world');
  const world = findWorldDefinition(worldId);
  return (
    <section className="child-world-space" data-world-space={worldId}>
      <header className="workspace-header child-header child-world-header">
        <div className="child-world-heading"><span className="eyebrow">Avec {world.mascotName}</span><h2>{world.name}</h2></div>
        <div className="child-world-actions"><Button variant="quiet" onClick={onHome}>Accueil</Button><Button variant="quiet" onClick={onBack}>Tous les univers</Button></div>
      </header>
      <TabBar tabs={tabs} active={tab} onChange={setTab} label={`Navigation ${world.name}`} />
      <div className="workspace-content">
        {tab === 'world' && <WorldView app={app} childId={childId} worldId={worldId} compact />}
        {tab === 'quests' && <ChildQuestList app={app} childId={childId} worldId={worldId} />}
        {tab === 'treasure' && <TreasurePanel app={app} childId={childId} worldId={worldId} />}
      </div>
    </section>
  );
}
