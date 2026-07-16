import { useState, type FormEvent } from 'react';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { Field } from '../../components/primitives/Field';

interface ParentLockProps {
  readonly hasPin: boolean;
  readonly onSetPin: (pin: string) => Promise<void>;
  readonly onUnlock: (pin: string) => boolean;
  readonly onBack: () => void;
}

export function ParentLock({ hasPin, onSetPin, onUnlock, onBack }: ParentLockProps) {
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    if (!/^\d{4}$/.test(pin)) {
      setMessage('Choisis quatre chiffres.');
      return;
    }
    if (hasPin) {
      if (!onUnlock(pin)) setMessage('Le code ne correspond pas.');
      return;
    }
    try {
      await onSetPin(pin);
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Code impossible à enregistrer.');
    }
  }

  return (
    <section className="centered-panel" data-page="parent-lock">
      <Card className="lock-card">
        <div className="space-symbol" aria-hidden="true">🧭</div>
        <p className="eyebrow">Espace parent</p>
        <h2>{hasPin ? 'Entre ton code' : 'Crée le code parent'}</h2>
        <p>Ce code sépare simplement les écrans adulte et enfant sur cet appareil familial.</p>
        <form className="stack" onSubmit={(event) => void submit(event)}>
          <Field label="Code à quatre chiffres">
            <input
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              aria-describedby={message ? 'pin-message' : undefined}
              autoComplete="off"
            />
          </Field>
          {message && <p className="form-message" id="pin-message" role="alert">{message}</p>}
          <div className="button-row">
            <Button type="submit">{hasPin ? 'Ouvrir' : 'Créer le code'}</Button>
            <Button variant="quiet" onClick={onBack}>Revenir</Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
