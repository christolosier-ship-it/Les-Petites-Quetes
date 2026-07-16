import { useState, type ChangeEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { Field } from '../../components/primitives/Field';
import { downloadTextFile } from '../../platform/files/downloadTextFile';
import { readTextFile } from '../../platform/files/readTextFile';

interface SettingsPanelProps {
  readonly app: FamilyAppController;
}

export function SettingsPanel({ app }: SettingsPanelProps) {
  const [message, setMessage] = useState('');
  const [newPin, setNewPin] = useState('');
  const [deletePhrase, setDeletePhrase] = useState('');

  function exportData() {
    downloadTextFile('les-petites-quetes-sauvegarde.json', app.exportBackup());
    setMessage('Sauvegarde téléchargée. Elle contient des informations familiales privées.');
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await app.importBackup(await readTextFile(file));
      setMessage('Sauvegarde vérifiée et restaurée.');
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Import impossible.');
    } finally {
      event.target.value = '';
    }
  }

  return (
    <div className="panel-grid">
      <Card as="section">
        <p className="eyebrow">Confort</p>
        <h3>Son et animations</h3>
        <div className="stack">
          <label className="toggle-row"><span>Lecture vocale</span><input type="checkbox" checked={app.state.settings.narrationEnabled} onChange={(event) => void app.updatePreferences({ narrationEnabled: event.target.checked })} /></label>
          <label className="toggle-row"><span>Effets sonores</span><input type="checkbox" checked={app.state.settings.soundEnabled} onChange={(event) => void app.updatePreferences({ soundEnabled: event.target.checked })} /></label>
          <Field label="Animations">
            <select value={app.state.settings.reducedMotion} onChange={(event) => void app.updatePreferences({ reducedMotion: event.target.value as 'system' | 'reduce' | 'allow' })}>
              <option value="system">Suivre l’appareil</option><option value="reduce">Réduire</option><option value="allow">Autoriser</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card as="section">
        <p className="eyebrow">Données privées</p>
        <h3>Sauvegarder et restaurer</h3>
        <p>L’export contient les profils, quêtes, historiques et progressions de cette famille.</p>
        <div className="button-row"><Button onClick={exportData}>Télécharger la sauvegarde</Button><label className="button button--secondary file-button">Restaurer un fichier<input type="file" accept="application/json,.json" onChange={(event) => void importData(event)} /></label></div>
      </Card>

      <Card as="section">
        <p className="eyebrow">Séparation parent</p>
        <h3>Changer le code</h3>
        <div className="inline-form"><input inputMode="numeric" maxLength={4} value={newPin} onChange={(event) => setNewPin(event.target.value.replace(/\D/g, '').slice(0, 4))} /><Button onClick={() => void app.setParentPin(newPin)}>Enregistrer</Button></div>
      </Card>

      <Card as="section" className="danger-card">
        <p className="eyebrow">Suppression totale</p>
        <h3>Effacer cet appareil</h3>
        <p>Écris SUPPRIMER pour retirer toutes les données locales.</p>
        <div className="inline-form"><input value={deletePhrase} onChange={(event) => setDeletePhrase(event.target.value)} /><Button variant="quiet" disabled={deletePhrase !== 'SUPPRIMER'} onClick={() => void app.resetAll()}>Tout effacer</Button></div>
      </Card>
      {message && <p className="form-message" role="status">{message}</p>}
    </div>
  );
}
