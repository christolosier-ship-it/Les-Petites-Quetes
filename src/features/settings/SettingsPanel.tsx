import { useState, type ChangeEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { Field } from '../../components/primitives/Field';
import { downloadTextFile } from '../../platform/files/downloadTextFile';
import { readTextFile } from '../../platform/files/readTextFile';

interface SettingsPanelProps {
  readonly app: FamilyAppController;
}

interface ImportPreview {
  readonly content: string;
  readonly profiles: number;
  readonly quests: number;
  readonly completions: number;
}

function previewImport(content: string): ImportPreview {
  const parsed = JSON.parse(content) as { state?: Record<string, unknown> };
  const state = parsed.state;
  if (!state) throw new Error('Le fichier ne contient aucun état familial.');
  return {
    content,
    profiles: Array.isArray(state.children) ? state.children.length : 0,
    quests: Array.isArray(state.schedules) ? state.schedules.length : 0,
    completions: Array.isArray(state.completions) ? state.completions.length : 0,
  };
}

export function SettingsPanel({ app }: SettingsPanelProps) {
  const [message, setMessage] = useState('');
  const [newPin, setNewPin] = useState('');
  const [deletePhrase, setDeletePhrase] = useState('');
  const [pendingImport, setPendingImport] = useState<ImportPreview>();
  const [restoreKey, setRestoreKey] = useState<string>();

  function exportData() {
    downloadTextFile('les-petites-quetes-sauvegarde.json', app.exportBackup());
    setMessage('Sauvegarde téléchargée. Elle contient des informations familiales privées.');
  }

  async function chooseImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setPendingImport(previewImport(await readTextFile(file)));
      setMessage('Vérifie le résumé avant de remplacer les données de cet appareil.');
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Lecture impossible.');
    } finally {
      event.target.value = '';
    }
  }

  async function confirmImport() {
    if (!pendingImport) return;
    try {
      await app.importBackup(pendingImport.content);
      setPendingImport(undefined);
      setMessage('Sauvegarde validée et restaurée. Une copie de l’ancien état a été conservée.');
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Import impossible.');
    }
  }

  async function confirmRestore() {
    if (!restoreKey) return;
    try {
      await app.restoreBackup(restoreKey);
      setRestoreKey(undefined);
      setMessage('Sauvegarde automatique restaurée. L’état précédent reste lui aussi sauvegardé.');
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Restauration impossible.');
    }
  }

  return (
    <div className="panel-grid">
      <Card as="section">
        <p className="eyebrow">Confort</p><h3>Son et animations</h3>
        <div className="stack">
          <label className="toggle-row"><span>Lecture vocale</span><input type="checkbox" checked={app.state.settings.narrationEnabled} onChange={(event) => void app.updatePreferences({ narrationEnabled: event.target.checked })} /></label>
          <label className="toggle-row"><span>Effets sonores courts</span><input type="checkbox" checked={app.state.settings.soundEnabled} onChange={(event) => void app.updatePreferences({ soundEnabled: event.target.checked })} /></label>
          <Field label="Animations"><select value={app.state.settings.reducedMotion} onChange={(event) => void app.updatePreferences({ reducedMotion: event.target.value as 'system' | 'reduce' | 'allow' })}><option value="system">Suivre l’appareil</option><option value="reduce">Réduire</option><option value="allow">Autoriser</option></select></Field>
          <Field label="Durée des célébrations"><select value={app.state.settings.celebrationDurationSeconds} onChange={(event) => void app.updatePreferences({ celebrationDurationSeconds: Number(event.target.value) as 3 | 5 | 8 })}><option value="3">Courte, 3 secondes</option><option value="5">Standard, 5 secondes</option><option value="8">Douce, 8 secondes</option></select></Field>
        </div>
      </Card>

      <Card as="section">
        <p className="eyebrow">Données privées</p><h3>Sauvegarder et restaurer</h3>
        <p>L’export contient les profils, quêtes, historiques et progressions de cette famille.</p>
        <div className="button-row"><Button onClick={exportData}>Télécharger la sauvegarde</Button><label className="button button--secondary file-button">Choisir un fichier<input type="file" accept="application/json,.json" onChange={(event) => void chooseImport(event)} /></label></div>
        {pendingImport && <Card className="confirmation-card"><h4>Contenu détecté</h4><p>{pendingImport.profiles} profil(s), {pendingImport.quests} planification(s), {pendingImport.completions} réalisation(s).</p><p>Les données actuelles seront sauvegardées avant le remplacement.</p><div className="button-row"><Button onClick={() => void confirmImport()}>Confirmer la restauration</Button><Button variant="quiet" onClick={() => setPendingImport(undefined)}>Annuler</Button></div></Card>}
      </Card>

      <Card as="section">
        <p className="eyebrow">Filets de sécurité</p><h3>Sauvegardes automatiques</h3>
        {app.backups.length === 0 ? <p>Aucune sauvegarde automatique pour le moment.</p> : app.backups.map((backup) => <div key={backup.key} className="list-card"><div><strong>{backup.reason}</strong><p>{new Date(backup.createdAt).toLocaleString('fr-FR')}</p></div><Button variant="quiet" onClick={() => setRestoreKey(backup.key)}>Restaurer</Button></div>)}
        {restoreKey && <div className="confirmation-card"><p>Restaurer cette sauvegarde automatique ? L’état actuel sera conservé avant l’opération.</p><div className="button-row"><Button onClick={() => void confirmRestore()}>Confirmer</Button><Button variant="quiet" onClick={() => setRestoreKey(undefined)}>Annuler</Button></div></div>}
      </Card>

      <Card as="section">
        <p className="eyebrow">Séparation parent</p><h3>Changer le code</h3>
        <div className="inline-form"><input aria-label="Nouveau code parent" inputMode="numeric" maxLength={4} value={newPin} onChange={(event) => setNewPin(event.target.value.replace(/\D/g, '').slice(0, 4))} /><Button disabled={newPin.length !== 4} onClick={() => void app.setParentPin(newPin)}>Enregistrer</Button></div>
      </Card>

      <Card as="section" className="danger-card">
        <p className="eyebrow">Suppression totale</p><h3>Effacer cet appareil</h3><p>Écris SUPPRIMER pour retirer toutes les données locales.</p>
        <div className="inline-form"><input aria-label="Confirmation de suppression" value={deletePhrase} onChange={(event) => setDeletePhrase(event.target.value)} /><Button variant="quiet" disabled={deletePhrase !== 'SUPPRIMER'} onClick={() => void app.resetAll()}>Tout effacer</Button></div>
      </Card>
      {message && <p className="form-message" role="status">{message}</p>}
    </div>
  );
}
