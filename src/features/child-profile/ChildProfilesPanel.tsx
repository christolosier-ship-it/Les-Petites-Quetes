import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { Field } from '../../components/primitives/Field';
import type { AgeBand, ReadingLevel } from '../../domain/shared/types';

interface ChildProfilesPanelProps {
  readonly app: FamilyAppController;
}

interface ProfileDraft {
  readonly displayName: string;
  readonly ageBand: AgeBand;
  readonly readingLevel: ReadingLevel;
  readonly avatarId: string;
  readonly accentId: string;
}

const emptyDraft: ProfileDraft = {
  displayName: '',
  ageBand: '3-5',
  readingLevel: 'visual',
  avatarId: 'avatar.firefly',
  accentId: 'accent.sunrise',
};
const avatars = [
  ['avatar.firefly', '✨ Luciole'],
  ['avatar.fox', '🦊 Renard'],
  ['avatar.owl', '🦉 Chouette'],
  ['avatar.hedgehog', '🦔 Hérisson'],
] as const;
const accents = [
  ['accent.sunrise', 'Soleil'],
  ['accent.moss', 'Mousse'],
  ['accent.sky', 'Ciel'],
  ['accent.berry', 'Baie'],
] as const;

function ProfileFields({ draft, onChange }: {
  readonly draft: ProfileDraft;
  readonly onChange: (draft: ProfileDraft) => void;
}) {
  return (
    <>
      <Field label="Prénom ou pseudonyme"><input value={draft.displayName} maxLength={30} required onChange={(event) => onChange({ ...draft, displayName: event.target.value })} /></Field>
      <Field label="Tranche d’âge"><select value={draft.ageBand} onChange={(event) => onChange({ ...draft, ageBand: event.target.value as AgeBand })}><option value="3-5">3 à 5 ans</option><option value="6-8">6 à 8 ans</option><option value="9-10">9 à 10 ans</option></select></Field>
      <Field label="Niveau de lecture"><select value={draft.readingLevel} onChange={(event) => onChange({ ...draft, readingLevel: event.target.value as ReadingLevel })}><option value="visual">Principalement visuel</option><option value="short-text">Phrases courtes</option><option value="independent">Lecture autonome</option></select></Field>
      <Field label="Compagnon"><select value={draft.avatarId} onChange={(event) => onChange({ ...draft, avatarId: event.target.value })}>{avatars.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
      <Field label="Couleur"><select value={draft.accentId} onChange={(event) => onChange({ ...draft, accentId: event.target.value })}>{accents.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
    </>
  );
}

export function ChildProfilesPanel({ app }: ChildProfilesPanelProps) {
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string>();
  const [editingDraft, setEditingDraft] = useState<ProfileDraft>(emptyDraft);

  async function create(event: FormEvent) {
    event.preventDefault();
    await app.createChild({ ...draft, activeWorldId: 'world.firefly-forest' });
    setDraft(emptyDraft);
  }

  async function saveEdit(event: FormEvent) {
    event.preventDefault();
    if (editingId === undefined) return;
    await app.updateChild(editingId, editingDraft);
    setEditingId(undefined);
  }

  function startEdit(child: FamilyAppController['state']['children'][number]) {
    setEditingId(child.id);
    setEditingDraft({
      displayName: child.displayName,
      ageBand: child.ageBand,
      readingLevel: child.readingLevel,
      avatarId: child.avatarId,
      accentId: child.accentId,
    });
  }

  const activeChildren = app.state.children.filter(
    (child) => !child.isArchived && child.deletedAt === undefined,
  );
  const archivedChildren = app.state.children.filter(
    (child) => child.isArchived && child.deletedAt === undefined,
  );

  return (
    <div className="panel-grid">
      <Card as="section">
        <p className="eyebrow">Nouveau profil</p><h3>Ajouter un enfant</h3>
        <form className="form-grid" onSubmit={(event) => void create(event)}>
          <ProfileFields draft={draft} onChange={setDraft} />
          <Button type="submit">Créer le profil</Button>
        </form>
      </Card>
      <section className="stack" aria-labelledby="children-title">
        <div><p className="eyebrow">Famille</p><h3 id="children-title">Profils actifs</h3></div>
        {activeChildren.length === 0 && <Card><p>Aucun profil actif pour le moment.</p></Card>}
        {activeChildren.map((child) => (
          <Card key={child.id} className="profile-card">
            {editingId === child.id ? (
              <form className="form-grid" onSubmit={(event) => void saveEdit(event)}>
                <ProfileFields draft={editingDraft} onChange={setEditingDraft} />
                <div className="button-row"><Button type="submit">Enregistrer</Button><Button variant="quiet" onClick={() => setEditingId(undefined)}>Annuler</Button></div>
              </form>
            ) : (
              <div className="list-card">
                <div><strong>{child.displayName}</strong><p>{child.ageBand} ans · {child.readingLevel} · {avatars.find(([id]) => id === child.avatarId)?.[1]}</p></div>
                <div className="button-row"><Button variant="quiet" onClick={() => startEdit(child)}>Modifier</Button><Button variant="quiet" onClick={() => void app.archiveChild(child.id)}>Archiver</Button></div>
              </div>
            )}
          </Card>
        ))}
        {archivedChildren.length > 0 && <div className="stack"><h4>Profils archivés</h4>{archivedChildren.map((child) => <Card key={child.id} className="list-card"><div><strong>{child.displayName}</strong><p>Conservé avec son historique.</p></div><Button variant="secondary" onClick={() => void app.restoreChild(child.id)}>Restaurer</Button></Card>)}</div>}
      </section>
    </div>
  );
}
