import { describe, expect, it } from 'vitest';
import { DomainError, type DomainErrorCode } from './errors';
import {
  addLocalDays,
  compareLocalDates,
  enumerateLocalDates,
  normalizeExactTime,
  normalizeLocalDate,
  weekdayOfLocalDate,
} from './localDate';

function expectDomainError(run: () => unknown, code: DomainErrorCode): void {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    if (error instanceof DomainError) expect(error.code).toBe(code);
    return;
  }
  throw new Error(`L’erreur métier ${code} était attendue.`);
}

describe('dates locales', () => {
  it('valide le format et les années bissextiles sans dépendre du navigateur', () => {
    expect(normalizeLocalDate(' 2024-02-29 ')).toBe('2024-02-29');
    expectDomainError(() => normalizeLocalDate('2025-02-29'), 'schedule.invalid-local-date');
    expectDomainError(() => normalizeLocalDate('16/07/2026'), 'schedule.invalid-local-date');
  });

  it('ajoute et retire des jours aux limites de mois et d’année', () => {
    expect(addLocalDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addLocalDays('2024-03-01', -1)).toBe('2024-02-29');
    expect(addLocalDays('2026-07-16', 0)).toBe('2026-07-16');
  });

  it('compare et détermine le jour de semaine de manière stable', () => {
    expect(compareLocalDates('2026-07-15', '2026-07-16')).toBe(-1);
    expect(compareLocalDates('2026-07-16', '2026-07-16')).toBe(0);
    expect(compareLocalDates('2026-07-17', '2026-07-16')).toBe(1);
    expect(weekdayOfLocalDate('2026-07-16')).toBe('thu');
  });

  it('valide une heure facultative au format 24 heures', () => {
    expect(normalizeExactTime(' 07:05 ')).toBe('07:05');
    expect(normalizeExactTime('23:59')).toBe('23:59');
    expectDomainError(() => normalizeExactTime('24:00'), 'schedule.invalid-exact-time');
    expectDomainError(() => normalizeExactTime('7:05'), 'schedule.invalid-exact-time');
  });

  it('énumère une fenêtre inclusive sans dépasser le budget annuel', () => {
    expect(enumerateLocalDates('2026-07-30', '2026-08-02')).toEqual([
      '2026-07-30',
      '2026-07-31',
      '2026-08-01',
      '2026-08-02',
    ]);
    expectDomainError(
      () => enumerateLocalDates('2026-08-02', '2026-07-30'),
      'occurrence.invalid-generation-window',
    );
    expectDomainError(
      () => enumerateLocalDates('2026-01-01', '2027-01-06'),
      'occurrence.generation-window-too-large',
    );
  });
});
