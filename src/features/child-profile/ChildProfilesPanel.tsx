import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { Field } from '../../components/primitives/Field';

interface ChildProfilesPanelProps {
  readonly app: FamilyAppController;
}

export function ChildProfilesPanel({ app }: ChildProfilesPanelProps) {
  const [name, setName] = useState('');
  const [ageBand, setAgeBand] = useState<'3-5' | '6-8' | '9-10'>('3-5');
  const [readingLevel, setReadingLevel] = useState<'visual' | 'short-text' | 'independent'>('visual');
  const [editingId, setEditingId] = useState<string>();
  const [editingName, setEditingName] = useState('');

  async function create(event: FormEvent) {
    event.preventDefault();
    await app.createChild({
      displayName: name,
      ageBand,
      readingLevel,
      avatarId: 'avatar.firefly',
      accentId: 'accent.sunrise',
      activeWorldId: 'world.firefly-forest',
    });
    setName('');
  }

  async function saveEdit(event: FormEvent) {
    event.preventDefault();
    if (editingId === undefined) return;
    await app.updateChild(editingId, { displayName: editingName });
    setEditingId(undefined);
  }

  const activeChildren = app.state.children.filter(
    (child) => !child.isArchived && child.deletedAt === undefined,
  );
  const archivedChildren = app.state.children.filter((child) => child.isArchived);

  return (
    <div className="panel-grid">
      <Card as="section">
        <p className="eyebrow">Nouveau profil</p>
        <h3>Ajouter un enfant</h3>
        <form className="form-grid" onSubmit={(event) => void create(event)}>
          <Field label="Prénom ou pseudonyme">
            <input value={name} maxLength={30} required onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Tranche d’âge">
            <select value={ageBand} onChange={(event) => setAgeBand(event.target.value as typeof ageBand)}>
              <option value="3-5">3 à 5 ans</option>
              <option value="6-8">6 à 8 ans</option>
              <option value="9-10">9 à 10 ans</option>
            </select>
          </Field>
          <Field label="Niveau de lecture">
            <select value={readingLevel} onChange={(event) => setReadingLevel(event.target.value as typeof readingLevel)}>
              <option value="visual">Principalement visuel</option>
              <option value="short-text">Phrases courtes</option>
              <option value="independent">Lecture autonome</option>
            </select>
          </Field>
          <Button type="submit">Créer le profil</Button>
        </form>
      </Card>

      <section className="stack" aria-labelledby="children-title">
        <div>
          <p className="eyebrow">Famille</p>
          <h3 id="children-title">Profils actifs</h3>
        </div>
        {activeChildren.length === 0 && <Card><p>Aucun profil actif pour le moment.</p></Card>}
        {activeChildren.map((child) => (
          <Card key={child.id} className="list-card">
            {editingId === child.id ? (
              <form className="inline-form" onSubmit={(event) => void saveEdit(event)}>
                <input value={editingName} required onChange={(event) => setEditingName(event.target.value)} />
                <Button type="submit">Enregistrer</Button>
              </form>
            ) : (
              <>
                <div>
                  <strong>{child.displayName}</strong>
                  <p>{child.ageBand} ans · {child.readingLevel}</p>
                </div>
                <div className="button-row">
                  <Button variant="quiet" onClick={() => { setEditingId(child.id); setEditingName(child.displayName); }}>Modifier</Button>
                  <Button variant="quiet" onClick={() => void app.archiveChild(child.id)}>Archiver</Button>
                </div>
              </>
            )}
          </Card>
        ))}
        {archivedChildren.length > 0 && <p className="muted">{archivedChildren.length} profil(s) archivé(s), conservés dans la sauvegarde.</p>}
      </section>
    </div>
  );
}
