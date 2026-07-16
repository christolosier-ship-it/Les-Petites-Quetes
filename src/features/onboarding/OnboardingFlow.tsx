import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { Field } from '../../components/primitives/Field';
import { avatarsForAgeBand, defaultAvatarForAge } from '../../content/avatars/avatarCatalog';
import type { AgeBand, ReadingLevel, ValidationMode } from '../../domain/shared/types';

interface OnboardingFlowProps {
  readonly app: FamilyAppController;
  readonly onComplete: () => void;
}

export function OnboardingFlow({ app, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [privateUseConfirmed, setPrivateUseConfirmed] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [ageBand, setAgeBand] = useState<AgeBand>('3-5');
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('visual');
  const [avatarId, setAvatarId] = useState(defaultAvatarForAge('3-5'));
  const [pin, setPin] = useState('');
  const [validationMode, setValidationMode] = useState<ValidationMode>('parent');
  const [questIds, setQuestIds] = useState<readonly string[]>(() => app.builtinTemplates.filter((template) => template.ageBands[0] === '3-5').slice(0, 3).map((template) => template.id));
  const [message, setMessage] = useState('');
  const suggestedTemplates = app.builtinTemplates.filter((template) => template.ageBands[0] === ageBand).slice(0, 6);

  function changeAgeBand(nextAgeBand: AgeBand) {
    setAgeBand(nextAgeBand);
    setAvatarId(defaultAvatarForAge(nextAgeBand));
    setQuestIds(app.builtinTemplates.filter((template) => template.ageBands[0] === nextAgeBand).slice(0, 3).map((template) => template.id));
  }

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
        child: { displayName, ageBand, readingLevel, avatarId },
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
            <p>Les petites actions font grandir six univers, chacun avec sa mascotte et ses aventures.</p>
            <ul className="gentle-list"><li>Aucun compte, aucune publicité.</li><li>Aucun classement ni série à préserver.</li><li>Les données restent sur cet appareil.</li></ul>
            <label className="toggle-row"><span>Je confirme un usage familial privé.</span><input type="checkbox" checked={privateUseConfirmed} onChange={(event) => setPrivateUseConfirmed(event.target.checked)} /></label>
            <Button disabled={!privateUseConfirmed} onClick={() => setStep(1)}>Créer le premier profil</Button>
          </div>
        )}
        {step === 1 && (
          <div className="stack">
            <h2>Qui part à l’aventure ?</h2>
            <Field label="Prénom ou pseudonyme"><input value={displayName} maxLength={30} required onChange={(event) => setDisplayName(event.target.value)} /></Field>
            <Field label="Tranche d’âge"><select value={ageBand} onChange={(event) => changeAgeBand(event.target.value as AgeBand)}><option value="3-5">3 à 5 ans</option><option value="6-8">6 à 8 ans</option><option value="9-10">9 à 10 ans</option></select></Field>
            <Field label="Niveau de lecture"><select value={readingLevel} onChange={(event) => setReadingLevel(event.target.value as ReadingLevel)}><option value="visual">Principalement visuel</option><option value="short-text">Phrases courtes</option><option value="independent">Lecture autonome</option></select></Field>
            <fieldset className="choice-grid"><legend>Avatar</legend>{avatarsForAgeBand(ageBand).map((avatar) => <label key={avatar.id}><input type="radio" name="avatar" checked={avatarId === avatar.id} onChange={() => setAvatarId(avatar.id)} /><span aria-hidden="true">{avatar.presentation === 'girl' ? '👧' : '👦'}</span> {avatar.label}</label>)}</fieldset>
            <div className="button-row"><Button variant="quiet" onClick={() => setStep(0)}>Retour</Button><Button disabled={displayName.trim().length === 0} onClick={() => setStep(2)}>Continuer</Button></div>
          </div>
        )}
        {step === 2 && (
          <form className="stack" onSubmit={(event) => void finish(event)}>
            <h2>Préparer les premières quêtes</h2>
            <Field label="Code parent à quatre chiffres"><input inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))} /></Field>
            <Field label="Validation par défaut"><select value={validationMode} onChange={(event) => setValidationMode(event.target.value as ValidationMode)}><option value="parent">Par un adulte</option><option value="together">Ensemble</option><option value="child">Immédiate par l’enfant</option></select></Field>
            <fieldset className="quest-choice-grid"><legend>Choisis une à trois quêtes</legend>{suggestedTemplates.map((template) => <label key={template.id}><input type="checkbox" checked={questIds.includes(template.id)} onChange={() => toggleQuest(template.id)} /><span>{template.title}</span><small>{template.instruction}</small></label>)}</fieldset>
            {message && <p className="form-message" role="alert">{message}</p>}
            <div className="button-row"><Button variant="quiet" onClick={() => setStep(1)}>Retour</Button><Button type="submit" disabled={pin.length !== 4 || questIds.length === 0}>Ouvrir les univers</Button></div>
          </form>
        )}
      </Card>
    </section>
  );
}
