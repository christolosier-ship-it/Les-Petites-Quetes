import type { IdGenerator } from '../../application/ports/IdGenerator';

export class CryptoIdGenerator implements IdGenerator {
  next(): string {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
