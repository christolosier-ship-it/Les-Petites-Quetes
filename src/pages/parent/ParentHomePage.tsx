import { Button } from '../../components/primitives/Button';
import { appCopy } from '../../content/validation/appCopy';

interface ParentHomePageProps {
  readonly onBack: () => void;
}

export function ParentHomePage({ onBack }: ParentHomePageProps) {
  return (
    <section className="space-page space-page--parent" data-page="parent">
      <div className="space-symbol" aria-hidden="true">🧭</div>
      <p className="eyebrow">Espace parent</p>
      <h2>Le poste de préparation est prêt</h2>
      <p>
        Les profils, modèles et planifications seront ajoutés dans des lots séparés après le domaine
        métier et la persistance.
      </p>
      <Button onClick={onBack} variant="quiet">
        {appCopy.backLabel}
      </Button>
    </section>
  );
}
