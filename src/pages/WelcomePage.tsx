import { getAsset, getAssetUrl } from '../assets/registry/catalog';
import { Button } from '../components/primitives/Button';
import { appCopy } from '../content/validation/appCopy';

interface WelcomePageProps {
  readonly onOpenChild: () => void;
  readonly onOpenParent: () => void;
}

export function WelcomePage({ onOpenChild, onOpenParent }: WelcomePageProps) {
  const worldAsset = getAsset('world.forest-placeholder');

  return (
    <section className="welcome-page" data-page="welcome">
      <div className="welcome-copy">
        <p className="eyebrow">Le premier sentier est tracé</p>
        <h2>{appCopy.welcomeTitle}</h2>
        <p>{appCopy.welcomeBody}</p>
        <div className="welcome-actions" aria-label="Choisir un espace">
          <Button onClick={onOpenChild}>{appCopy.childSpaceLabel}</Button>
          <Button onClick={onOpenParent} variant="secondary">
            {appCopy.parentSpaceLabel}
          </Button>
        </div>
      </div>
      <figure className="world-preview">
        <img src={getAssetUrl(worldAsset.id)} alt={worldAsset.alt} />
        <figcaption>Décor provisoire utilisé pour valider le pipeline des assets.</figcaption>
      </figure>
    </section>
  );
}
