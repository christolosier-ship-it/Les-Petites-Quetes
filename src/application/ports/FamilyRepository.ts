import type { FamilyState } from '../model/FamilyState';

export interface FamilyBackupSummary {
  readonly key: string;
  readonly reason: string;
  readonly createdAt: string;
}

export interface FamilyRepository {
  load(): Promise<FamilyState>;
  save(state: FamilyState): Promise<void>;
  createBackup(state: FamilyState, reason: string, createdAt: string): Promise<void>;
  replaceWithBackup(
    current: FamilyState,
    next: FamilyState,
    reason: string,
    createdAt: string,
  ): Promise<void>;
  listBackups(): Promise<readonly FamilyBackupSummary[]>;
  restoreBackup(key: string, createdAt: string): Promise<FamilyState>;
  clear(): Promise<void>;
}
