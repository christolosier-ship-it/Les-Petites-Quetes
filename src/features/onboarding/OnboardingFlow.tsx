import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { Field } from '../../components/primitives/Field';
import type { AgeBand, ReadingLevel, ValidationMode } from '../../domain/shared/types';

interface OnboardingFlowProps {
  readonly app: FamilyAppController;
  readonly onComplete: () => void;
}

const suggestedQuests = [
  ['quest.dress', 'S’habiller'],
  ['quest.brush-teeth', 'Se brosser les dents'],
  ['quest.pyjamas', 'Mettre son pyjama'],
  ['quest.set-table', 'Aider pour la table'],
  ['quest.read', 'Regarder un livre'],
  ['quest.breathe', 'Respirer doucement'],
] as const;
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

export function OnboardingFlow({ app, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [privateUseConfirmed, setPrivateUseConfirmed] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [ageBand, setAgeBand] = useState<AgeBand>('3-5');
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('visual');
  const [avatarId, setAvatarId] = useState('avatar.firefly');
  const [accentId, setAccentId] = useState('accent.sunrise');
  const [pin, setPin] = useState('');
  const [validationMode, setValidationMode] = useState<ValidationMode>('parent');
  const [questIds, setQuestIds] = useState<readonly string[]>([
    'quest.dress',
    'quest.brush-teeth',
    'quest.pyjamas',
  ]);
  const [message, setMessage] = useState('');

  function toggleQuest(id: string) {
    setQuestIds((current) => current.includes(id)
      ? current.filter((candidate) => candidate !== id)
      : current.length < 3 ? [...current, id] : current);
  }

  async function finish(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    try {
      await app.completeOnboarding({
        pin,
        child: {
          displayName,
          ageBand,
          readingLevel,
          avatarId,
          accentId,
          activeWorldId: 'world.firefly-forest',
        },
        defaultValidationMode: validationMode,
        suggestedTemplateIds: questIds,
      });
      onComplete();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Premier lancement impossible.');
    }
  }

  return (
    <section className="onboarding" data-page="onboarding">
      <Card className="onboarding-card">
        <p className="eyebrow">Première aventure · étape {step + 1} sur 3</p>
        {step === 0 && (
          <div className="stack">
            <h2>Bienvenue dans Les Petites Quêtes</h2>
            <p>Un adulte prépare de petites actions. L’enfant quitte l’écran pour les réaliser, puis la forêt grandit avec lui.</p>
            <ul className="gentle-list">
              <li>Aucun compte, aucune publicité.</li>
              <li>Aucun classement, aucune série à préserver.</li>
              <li>Les données restent sur cet appareil.</li>
            </ul>
            <label className="toggle-row">
              <span>Je confirme un usage familial privé.</span>
              <input type="checkbox" checked={privateUseConfirmed} onChange={(event) => setPrivateUseConfirmed(event.target.checked)} />
            </label>
            <Button disabled={!privateUseConfirmed} onClick={() => setStep(1)}>Créer le premier profil</Button>
          </div>
        )}
        {step === 1 && (
          <div className="stack">
            <h2>Qui part à l’aventure ?</h2>
            <Field label="Prénom ou pseudonyme">
              <input value={displayName} maxLength={30} required onChange={(event) => setDisplayName(event.target.value)} />
            </Field>
            <Field label="Tranche d’âge">
              <select value={ageBand} onChange={(event) => setAgeBand(event.target.value as AgeBand)}>
                <option value="3-5">3 à 5 ans</option><option value="6-8">6 à 8 ans</option><option value="9-10">9 à 10 ans</option>
              </select>
            </Field>
            <Field label="Niveau de lecture">
              <select value={readingLevel} onChange={(event) => setReadingLevel(event.target.value as ReadingLevel)}>
                <option value="visual">Principalement visuel</option><option value="short-text">Phrases courtes</option><option value="independent">Lecture autonome</option>
              </select>
            </Field>
            <fieldset className="choice-grid"><legend>Compagnon</legend>{avatars.map(([id, label]) => <label key={id}><input type="radio" name="avatar" checked={avatarId === id} onChange={() => setAvatarId(id)} />{label}</label>)}</fieldset>
            <fieldset className="choice-grid"><legend>Couleur</legend>{accents.map(([id, label]) => <label key={id}><input type="radio" name="accent" checked={accentId === id} onChange={() => setAccentId(id)} />{label}</label>)}</fieldset>
            <div className="button-row"><Button variant="quiet" onClick={() => setStep(0)}>Retour</Button><Button disabled={displayName.trim().length === 0} onClick={() => setStep(2)}>Continuer</Button></div>
          </div>
        )}
        {step === 2 && (
          <form className="stack" onSubmit={(event) => void finish(event)}>
            <h2>Préparer les premières quêtes</h2>
            <Field label="Code parent à quatre chiffres"><input inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))} /></Field>
            <Field label="Validation par défaut">
              <select value={validationMode} onChange={(event) => setValidationMode(event.target.value as ValidationMode)}>
                <option value="parent">Par un adulte</option><option value="together">Ensemble</option><option value="child">Immédiate par l’enfant</option>
              </select>
            </Field>
            <fieldset className="quest-choice-grid"><legend>Choisis une à trois quêtes</legend>{suggestedQuests.map(([id, label]) => <label key={id}><input type="checkbox" checked={questIds.includes(id)} onChange={() => toggleQuest(id)} />{label}</label>)}</fieldset>
            {message && <p className="form-message" role="alert">{message}</p>}
            <div className="button-row"><Button variant="quiet" onClick={() => setStep(1)}>Retour</Button><Button type="submit" disabled={pin.length !== 4 || questIds.length === 0}>Ouvrir la forêt</Button></div>
          </form>
        )}
      </Card>
    </section>
  );
}
