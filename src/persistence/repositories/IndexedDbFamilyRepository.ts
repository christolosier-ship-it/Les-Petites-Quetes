import { SCHEMA_VERSION, type FamilyState } from '../../application/model/FamilyState';
import type {
  FamilyBackupSummary,
  FamilyRepository,
} from '../../application/ports/FamilyRepository';
import {
  inspectSchemaVersion,
  migrateFamilyState,
} from '../migrations/migrateFamilyState';

const DATABASE_NAME = 'les-petites-quetes';
const DATABASE_VERSION = 2;
const STATE_STORE = 'familyState';
const BACKUP_STORE = 'familyBackups';
const JOURNAL_STORE = 'migrationJournal';
const CURRENT_KEY = 'current';
let memoryState: unknown;
const memoryBackups = new Map<string, StoredBackup>();
const memoryJournal: StoredMigration[] = [];

interface StoredState {
  readonly key: typeof CURRENT_KEY;
  readonly value: unknown;
}

interface StoredBackup extends FamilyBackupSummary {
  readonly value: unknown;
}

interface StoredMigration {
  readonly key: string;
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly createdAt: string;
  readonly status: 'completed';
}

function supportsIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined';
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result));
    request.addEventListener('error', () => reject(request.error ?? new Error('Erreur IndexedDB.')));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.addEventListener('complete', () => resolve());
    transaction.addEventListener('abort', () => reject(transaction.error ?? new Error('Transaction annulée.')));
    transaction.addEventListener('error', () => reject(transaction.error ?? new Error('Transaction en échec.')));
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.addEventListener('upgradeneeded', () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STATE_STORE)) {
        database.createObjectStore(STATE_STORE, { keyPath: 'key' });
      }
      if (!database.objectStoreNames.contains(BACKUP_STORE)) {
        database.createObjectStore(BACKUP_STORE, { keyPath: 'key' });
      }
      if (!database.objectStoreNames.contains(JOURNAL_STORE)) {
        database.createObjectStore(JOURNAL_STORE, { keyPath: 'key' });
      }
    });
    request.addEventListener('success', () => resolve(request.result));
    request.addEventListener('error', () => reject(request.error ?? new Error('Impossible d’ouvrir IndexedDB.')));
  });
}

function backupKey(createdAt: string, reason: string): string {
  return `${createdAt}:${reason}`;
}

function backupRecord(state: unknown, reason: string, createdAt: string): StoredBackup {
  return { key: backupKey(createdAt, reason), reason, createdAt, value: state };
}

function migrationRecord(fromVersion: number, createdAt: string): StoredMigration {
  return {
    key: `${createdAt}:v${fromVersion}-v${SCHEMA_VERSION}`,
    fromVersion,
    toVersion: SCHEMA_VERSION,
    createdAt,
    status: 'completed',
  };
}

function migrationTime(): string {
  return new Date().toISOString();
}

export class IndexedDbFamilyRepository implements FamilyRepository {
  async load(): Promise<FamilyState> {
    if (!supportsIndexedDb()) {
      if (memoryState === undefined) return migrateFamilyState(undefined);
      const fromVersion = inspectSchemaVersion(memoryState);
      const migrated = migrateFamilyState(memoryState);
      if (fromVersion !== undefined && fromVersion !== SCHEMA_VERSION) {
        const createdAt = migrationTime();
        const backup = backupRecord(memoryState, `before-migration-v${fromVersion}`, createdAt);
        memoryBackups.set(backup.key, backup);
        memoryJournal.push(migrationRecord(fromVersion, createdAt));
        memoryState = migrated;
      }
      return migrated;
    }
    const database = await openDatabase();
    try {
      const read = database.transaction(STATE_STORE, 'readonly');
      const stored = await requestResult(
        read.objectStore(STATE_STORE).get(CURRENT_KEY) as IDBRequest<StoredState | undefined>,
      );
      await transactionDone(read);
      if (stored === undefined) return migrateFamilyState(undefined);
      const fromVersion = inspectSchemaVersion(stored.value);
      const migrated = migrateFamilyState(stored.value);
      if (fromVersion === SCHEMA_VERSION) return migrated;
      const createdAt = migrationTime();
      const transaction = database.transaction([STATE_STORE, BACKUP_STORE, JOURNAL_STORE], 'readwrite');
      transaction.objectStore(BACKUP_STORE).put(
        backupRecord(stored.value, `before-migration-v${String(fromVersion)}`, createdAt),
      );
      transaction.objectStore(STATE_STORE).put({ key: CURRENT_KEY, value: migrated } satisfies StoredState);
      transaction.objectStore(JOURNAL_STORE).put(migrationRecord(fromVersion!, createdAt));
      await transactionDone(transaction);
      return migrated;
    } finally {
      database.close();
    }
  }

  async save(state: FamilyState): Promise<void> {
    const validated = migrateFamilyState(state);
    if (!supportsIndexedDb()) {
      memoryState = validated;
      return;
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction(STATE_STORE, 'readwrite');
      transaction.objectStore(STATE_STORE).put({ key: CURRENT_KEY, value: validated } satisfies StoredState);
      await transactionDone(transaction);
    } finally {
      database.close();
    }
  }

  async createBackup(state: FamilyState, reason: string, createdAt: string): Promise<void> {
    const validated = migrateFamilyState(state);
    const backup = backupRecord(validated, reason, createdAt);
    if (!supportsIndexedDb()) {
      memoryBackups.set(backup.key, backup);
      return;
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction(BACKUP_STORE, 'readwrite');
      transaction.objectStore(BACKUP_STORE).put(backup);
      await transactionDone(transaction);
    } finally {
      database.close();
    }
  }

  async replaceWithBackup(
    current: FamilyState,
    next: FamilyState,
    reason: string,
    createdAt: string,
  ): Promise<void> {
    const validCurrent = migrateFamilyState(current);
    const validNext = migrateFamilyState(next);
    const backup = backupRecord(validCurrent, reason, createdAt);
    if (!supportsIndexedDb()) {
      memoryBackups.set(backup.key, backup);
      memoryState = validNext;
      return;
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction([STATE_STORE, BACKUP_STORE], 'readwrite');
      transaction.objectStore(BACKUP_STORE).put(backup);
      transaction.objectStore(STATE_STORE).put({ key: CURRENT_KEY, value: validNext } satisfies StoredState);
      await transactionDone(transaction);
    } finally {
      database.close();
    }
  }

  async listBackups(): Promise<readonly FamilyBackupSummary[]> {
    if (!supportsIndexedDb()) {
      return [...memoryBackups.values()]
        .map(({ key, reason, createdAt }) => ({ key, reason, createdAt }))
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction(BACKUP_STORE, 'readonly');
      const backups = await requestResult(
        transaction.objectStore(BACKUP_STORE).getAll() as IDBRequest<StoredBackup[]>,
      );
      await transactionDone(transaction);
      return backups
        .map(({ key, reason, createdAt }) => ({ key, reason, createdAt }))
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    } finally {
      database.close();
    }
  }

  async restoreBackup(key: string, createdAt: string): Promise<FamilyState> {
    if (!supportsIndexedDb()) {
      const backup = memoryBackups.get(key);
      if (!backup) throw new Error('Sauvegarde automatique introuvable.');
      const restored = migrateFamilyState(backup.value);
      if (memoryState !== undefined) {
        const currentBackup = backupRecord(memoryState, 'before-restore', createdAt);
        memoryBackups.set(currentBackup.key, currentBackup);
      }
      memoryState = restored;
      return restored;
    }
    const database = await openDatabase();
    try {
      const read = database.transaction([STATE_STORE, BACKUP_STORE], 'readonly');
      const backup = await requestResult(
        read.objectStore(BACKUP_STORE).get(key) as IDBRequest<StoredBackup | undefined>,
      );
      const current = await requestResult(
        read.objectStore(STATE_STORE).get(CURRENT_KEY) as IDBRequest<StoredState | undefined>,
      );
      await transactionDone(read);
      if (!backup) throw new Error('Sauvegarde automatique introuvable.');
      const restored = migrateFamilyState(backup.value);
      const transaction = database.transaction([STATE_STORE, BACKUP_STORE], 'readwrite');
      if (current !== undefined) {
        transaction.objectStore(BACKUP_STORE).put(backupRecord(current.value, 'before-restore', createdAt));
      }
      transaction.objectStore(STATE_STORE).put({ key: CURRENT_KEY, value: restored } satisfies StoredState);
      await transactionDone(transaction);
      return restored;
    } finally {
      database.close();
    }
  }

  async clear(): Promise<void> {
    if (!supportsIndexedDb()) {
      memoryState = undefined;
      memoryBackups.clear();
      memoryJournal.length = 0;
      return;
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction([STATE_STORE, BACKUP_STORE, JOURNAL_STORE], 'readwrite');
      transaction.objectStore(STATE_STORE).clear();
      transaction.objectStore(BACKUP_STORE).clear();
      transaction.objectStore(JOURNAL_STORE).clear();
      await transactionDone(transaction);
    } finally {
      database.close();
    }
  }
}
