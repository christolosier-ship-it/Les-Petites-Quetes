import type { FamilyAppController } from '../app/controller/FamilyAppController';
import { Button } from '../components/primitives/Button';
import { Card } from '../components/primitives/Card';

interface WelcomePageProps {
  readonly app: FamilyAppController;
  readonly onOpenChild: () => void;
  readonly onOpenParent: () => void;
}

export function WelcomePage({ app, onOpenChild, onOpenParent }: WelcomePageProps) {
  const activeChildren = app.state.children.filter((child) => !child.isArchived && child.deletedAt === undefined);
  const available = app.state.occurrences.filter((item) => item.deletedAt === undefined && item.status === 'available').length;
  const pending = app.state.occurrences.filter((item) => item.deletedAt === undefined && item.status === 'validation-requested').length;

  return (
    <section className="family-gateway" data-page="welcome" aria-label="Choisir un espace">
      <button type="button" className="gateway-pane gateway-pane--child" onClick={onOpenChild} disabled={activeChildren.length === 0}>
        <span className="gateway-pane__illustration" aria-hidden="true">🌍</span>
        <span className="eyebrow">À gauche</span>
        <strong>Espace enfant</strong>
        <span>Choisir son avatar, découvrir les six univers et voir les quêtes disponibles.</span>
        {available > 0 && <span className="gateway-notice">{available} quête{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''}</span>}
      </button>
      <button type="button" className="gateway-pane gateway-pane--parent" onClick={onOpenParent}>
        <span className="gateway-pane__illustration" aria-hidden="true">🧭</span>
        <span className="eyebrow">À droite</span>
        <strong>Espace parent</strong>
        <span>Créer les profils, préparer les quêtes et suivre chaque univers.</span>
        {pending > 0 && <span className="gateway-notice gateway-notice--parent">{pending} validation{pending > 1 ? 's' : ''}</span>}
      </button>
      {activeChildren.length === 0 && <Card className="gateway-help"><p>Commence par l’espace parent pour créer le premier profil.</p><Button onClick={onOpenParent}>Créer un profil</Button></Card>}
      {app.error && <Card className="form-message"><p role="alert">{app.error}</p></Card>}
    </section>
  );
}
