import type { FamilyAppController } from '../app/controller/useFamilyApp';
import { getAsset, getAssetUrl } from '../assets/registry/catalog';
import { Button } from '../components/primitives/Button';
import { Card } from '../components/primitives/Card';

interface WelcomePageProps {
  readonly app: FamilyAppController;
  readonly onOpenChild: () => void;
  readonly onOpenParent: () => void;
}

export function WelcomePage({ app, onOpenChild, onOpenParent }: WelcomePageProps) {
  const worldAsset = getAsset('world.forest-stage-0');
  const activeChildren = app.state.children.filter((child) => !child.isArchived && child.deletedAt === undefined);
  const pending = app.state.occurrences.filter((item) => item.status === 'validation-requested').length;

  return (
    <section className="welcome-page" data-page="welcome">
      <div className="welcome-copy">
        <p className="eyebrow">Petit effort, monde qui grandit</p>
        <h2>Les petites actions deviennent des aventures</h2>
        <p>Un adulte prépare les quêtes. L’enfant les réalise dans le monde réel, puis réveille peu à peu La Forêt des Lucioles.</p>
        <div className="welcome-actions" aria-label="Choisir un espace">
          <Button onClick={onOpenChild} disabled={activeChildren.length === 0}>Espace enfant</Button>
          <Button onClick={onOpenParent} variant="secondary">Espace parent</Button>
        </div>
        {activeChildren.length === 0 ? (
          <p className="welcome-hint">Commence par l’espace parent pour créer le premier profil.</p>
        ) : (
          <div className="welcome-stats"><span>🧒 {activeChildren.length} profil(s)</span><span>🧭 {pending} validation(s)</span><span>✨ {app.state.rewardGrants.length} lumière(s)</span></div>
        )}
      </div>
      <figure className="world-preview">
        <img src={getAssetUrl(worldAsset.id)} alt={worldAsset.alt} />
        <figcaption>La Forêt des Lucioles grandit sans points, classement ni série à préserver.</figcaption>
      </figure>
      {app.error && <Card className="form-message"><p role="alert">{app.error}</p></Card>}
    </section>
  );
}
