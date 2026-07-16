import type { FamilyState } from '../../application/model/FamilyState';
import type { FamilyRepository } from '../../application/ports/FamilyRepository';
import { migrateFamilyState } from '../migrations/migrateFamilyState';

const DATABASE_NAME = 'les-petites-quetes';
const DATABASE_VERSION = 1;
const STATE_STORE = 'familyState';
const BACKUP_STORE = 'migrationBackups';
const CURRENT_KEY = 'current';
let memoryState: FamilyState | undefined;
const memoryBackups: FamilyState[] = [];

interface StoredState {
  readonly key: typeof CURRENT_KEY;
  readonly value: FamilyState;
}

interface StoredBackup {
  readonly key: string;
  readonly reason: string;
  readonly createdAt: string;
  readonly value: FamilyState;
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
    });
    request.addEventListener('success', () => resolve(request.result));
    request.addEventListener('error', () => reject(request.error ?? new Error('Impossible d’ouvrir IndexedDB.')));
  });
}

export class IndexedDbFamilyRepository implements FamilyRepository {
  async load(): Promise<FamilyState> {
    if (!supportsIndexedDb()) return migrateFamilyState(memoryState);
    const database = await openDatabase();
    try {
      const transaction = database.transaction(STATE_STORE, 'readonly');
      const stored = await requestResult(
        transaction.objectStore(STATE_STORE).get(CURRENT_KEY) as IDBRequest<StoredState | undefined>,
      );
      await transactionDone(transaction);
      return migrateFamilyState(stored?.value);
    } finally {
      database.close();
    }
  }

  async save(state: FamilyState): Promise<void> {
    if (!supportsIndexedDb()) {
      memoryState = state;
      return;
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction(STATE_STORE, 'readwrite');
      transaction.objectStore(STATE_STORE).put({ key: CURRENT_KEY, value: state } satisfies StoredState);
      await transactionDone(transaction);
    } finally {
      database.close();
    }
  }

  async createBackup(state: FamilyState, reason: string, createdAt: string): Promise<void> {
    if (!supportsIndexedDb()) {
      memoryBackups.push(state);
      return;
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction(BACKUP_STORE, 'readwrite');
      const key = `${createdAt}:${reason}`;
      transaction.objectStore(BACKUP_STORE).put({ key, reason, createdAt, value: state } satisfies StoredBackup);
      await transactionDone(transaction);
    } finally {
      database.close();
    }
  }

  async clear(): Promise<void> {
    if (!supportsIndexedDb()) {
      memoryState = undefined;
      memoryBackups.length = 0;
      return;
    }
    const database = await openDatabase();
    try {
      const transaction = database.transaction([STATE_STORE, BACKUP_STORE], 'readwrite');
      transaction.objectStore(STATE_STORE).clear();
      transaction.objectStore(BACKUP_STORE).clear();
      await transactionDone(transaction);
    } finally {
      database.close();
    }
  }
}
