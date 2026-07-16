import { Button } from '../../components/primitives/Button';
import { appCopy } from '../../content/validation/appCopy';

interface ChildHomePageProps {
  readonly onBack: () => void;
}

export function ChildHomePage({ onBack }: ChildHomePageProps) {
  return (
    <section className="space-page space-page--child" data-page="child">
      <div className="space-symbol" aria-hidden="true">✨</div>
      <p className="eyebrow">Espace enfant</p>
      <h2>Les quêtes arrivent bientôt</h2>
      <p>
        Cet écran valide la navigation, les zones tactiles et le fonctionnement sans son avant
        l’ajout du moteur de quêtes.
      </p>
      <Button onClick={onBack} variant="quiet">
        {appCopy.backLabel}
      </Button>
    </section>
  );
}
