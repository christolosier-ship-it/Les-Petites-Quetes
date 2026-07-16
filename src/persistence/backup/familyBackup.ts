import type { FamilyState } from '../../application/model/FamilyState';
import { migrateFamilyState } from '../migrations/migrateFamilyState';

export interface FamilyBackupEnvelope {
  readonly format: 'les-petites-quetes-backup';
  readonly exportedAt: string;
  readonly warning: string;
  readonly state: FamilyState;
}

export function serializeFamilyBackup(state: FamilyState, exportedAt: string): string {
  const envelope: FamilyBackupEnvelope = {
    format: 'les-petites-quetes-backup',
    exportedAt,
    warning: 'Ce fichier contient des informations familiales privées. Conservez-le avec soin.',
    state,
  };
  return JSON.stringify(envelope, null, 2);
}

export function parseFamilyBackup(content: string): FamilyBackupEnvelope {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Le fichier sélectionné n’est pas un JSON valide.');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Le contenu de la sauvegarde est invalide.');
  }
  const record = parsed as Record<string, unknown>;
  if (record.format !== 'les-petites-quetes-backup' || typeof record.exportedAt !== 'string') {
    throw new Error('Ce fichier n’est pas une sauvegarde Les Petites Quêtes.');
  }
  return {
    format: 'les-petites-quetes-backup',
    exportedAt: record.exportedAt,
    warning:
      typeof record.warning === 'string'
        ? record.warning
        : 'Ce fichier contient des informations familiales privées.',
    state: migrateFamilyState(record.state),
  };
}
