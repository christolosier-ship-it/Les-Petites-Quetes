import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { TabBar } from '../../components/layout/TabBar';
import { Button } from '../../components/primitives/Button';
import { ChildProfilesPanel } from '../../features/child-profile/ChildProfilesPanel';
import { ParentLock } from '../../features/parent-lock/ParentLock';
import { QuestLibraryPanel } from '../../features/quest-library/QuestLibraryPanel';
import { SettingsPanel } from '../../features/settings/SettingsPanel';
import { ParentTodayPanel } from '../../features/validation/ParentTodayPanel';
import { ParentWorldsPanel } from '../../features/world-progression/ParentWorldsPanel';

interface ParentHomePageProps { readonly app: FamilyAppController; readonly onBack: () => void; }
type ParentTab = 'today' | 'quests' | 'children' | 'world' | 'settings';
const tabs = [
  { id: 'today', label: 'Aujourd’hui', icon: '☀️' },
  { id: 'quests', label: 'Quêtes', icon: '🗺️' },
  { id: 'children', label: 'Enfants', icon: '🧒' },
  { id: 'world', label: 'Univers', icon: '✨' },
  { id: 'settings', label: 'Réglages', icon: '⚙️' },
] as const;

export function ParentHomePage({ app, onBack }: ParentHomePageProps) {
  const [tab, setTab] = useState<ParentTab>('today');
  if (!app.parentUnlocked) return <ParentLock hasPin={app.state.settings.parentPin.length > 0} onSetPin={app.setParentPin} onUnlock={app.unlockParent} onBack={onBack} />;
  return (
    <section className="workspace" data-page="parent">
      <header className="workspace-header"><div><p className="eyebrow">Espace parent</p><h2>Préparer les petites aventures</h2></div><div className="button-row"><Button variant="quiet" onClick={app.lockParent}>Verrouiller</Button><Button variant="quiet" onClick={onBack}>Accueil</Button></div></header>
      {app.error && <p className="form-message" role="alert">{app.error}</p>}
      <TabBar tabs={tabs} active={tab} onChange={setTab} label="Navigation parent" />
      <div className="workspace-content">
        {tab === 'today' && <ParentTodayPanel app={app} />}
        {tab === 'quests' && <QuestLibraryPanel app={app} />}
        {tab === 'children' && <ChildProfilesPanel app={app} />}
        {tab === 'world' && <ParentWorldsPanel app={app} />}
        {tab === 'settings' && <SettingsPanel app={app} />}
      </div>
    </section>
  );
}
