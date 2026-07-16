import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { TabBar } from '../../components/layout/TabBar';
import { Button } from '../../components/primitives/Button';
import { findWorldDefinition } from '../../content/world/worldCatalog';
import type { WorldId } from '../../domain/world/WorldDefinition';
import { ChildQuestList } from '../daily-quests/ChildQuestList';
import { TreasurePanel } from '../storybook/TreasurePanel';
import { WorldView } from '../world-progression/WorldView';

interface ChildWorldSpaceProps {
  readonly app: FamilyAppController;
  readonly childId: string;
  readonly worldId: WorldId;
  readonly onBack: () => void;
}

type ChildTab = 'world' | 'quests' | 'treasure';
const tabs = [
  { id: 'world', label: 'Mon univers', icon: '🌍' },
  { id: 'quests', label: 'Mes quêtes', icon: '✨' },
  { id: 'treasure', label: 'Mon trésor', icon: '🎒' },
] as const;

export function ChildWorldSpace({ app, childId, worldId, onBack }: ChildWorldSpaceProps) {
  const [tab, setTab] = useState<ChildTab>('world');
  const world = findWorldDefinition(worldId);
  return (
    <section className="child-world-space" data-world-space={worldId}>
      <header className="workspace-header child-header"><div><p className="eyebrow">Avec {world.mascotName}</p><h2>{world.name}</h2></div><Button variant="quiet" onClick={onBack}>Tous les univers</Button></header>
      <TabBar tabs={tabs} active={tab} onChange={setTab} label={`Navigation ${world.name}`} />
      <div className="workspace-content">
        {tab === 'world' && <WorldView app={app} childId={childId} worldId={worldId} compact />}
        {tab === 'quests' && <ChildQuestList app={app} childId={childId} worldId={worldId} />}
        {tab === 'treasure' && <TreasurePanel app={app} childId={childId} worldId={worldId} />}
      </div>
    </section>
  );
}
