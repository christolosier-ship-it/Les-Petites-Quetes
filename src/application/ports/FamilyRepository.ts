import type { FamilyState } from '../model/FamilyState';

export interface FamilyRepository {
  load(): Promise<FamilyState>;
  save(state: FamilyState): Promise<void>;
  createBackup(state: FamilyState, reason: string, createdAt: string): Promise<void>;
  clear(): Promise<void>;
}
