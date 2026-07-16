import { assertDomain } from './errors';
import { WEEKDAYS, type Weekday } from './types';

const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const EXACT_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

interface LocalDateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number): number {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1] ?? 0;
}

function parseLocalDate(value: string, field: string): LocalDateParts {
  const match = LOCAL_DATE_PATTERN.exec(value.trim());
  assertDomain(
    match !== null,
    'schedule.invalid-local-date',
    'La date doit utiliser le format YYYY-MM-DD.',
    field,
  );

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  assertDomain(
    year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month),
    'schedule.invalid-local-date',
    'La date locale est impossible.',
    field,
  );

  return { year, month, day };
}

function formatLocalDate(parts: LocalDateParts): string {
  return `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(
    parts.day,
  ).padStart(2, '0')}`;
}

export function normalizeLocalDate(value: string, field = 'localDate'): string {
  return formatLocalDate(parseLocalDate(value, field));
}

export function normalizeExactTime(value: string, field = 'exactTime'): string {
  const normalized = value.trim();
  assertDomain(
    EXACT_TIME_PATTERN.test(normalized),
    'schedule.invalid-exact-time',
    'L’heure doit utiliser le format HH:mm entre 00:00 et 23:59.',
    field,
  );
  return normalized;
}

export function compareLocalDates(left: string, right: string): number {
  const normalizedLeft = normalizeLocalDate(left, 'leftDate');
  const normalizedRight = normalizeLocalDate(right, 'rightDate');
  return normalizedLeft < normalizedRight ? -1 : normalizedLeft > normalizedRight ? 1 : 0;
}

export function addLocalDays(value: string, amount: number): string {
  let parts = parseLocalDate(value, 'localDate');
  assertDomain(
    Number.isInteger(amount),
    'schedule.invalid-local-date',
    'Le décalage de date doit être un nombre entier de jours.',
    'amount',
  );

  const direction = amount >= 0 ? 1 : -1;
  for (let index = 0; index < Math.abs(amount); index += 1) {
    if (direction > 0) {
      const maximum = daysInMonth(parts.year, parts.month);
      parts =
        parts.day < maximum
          ? { ...parts, day: parts.day + 1 }
          : parts.month < 12
            ? { year: parts.year, month: parts.month + 1, day: 1 }
            : { year: parts.year + 1, month: 1, day: 1 };
    } else {
      parts =
        parts.day > 1
          ? { ...parts, day: parts.day - 1 }
          : parts.month > 1
            ? {
                year: parts.year,
                month: parts.month - 1,
                day: daysInMonth(parts.year, parts.month - 1),
              }
            : { year: parts.year - 1, month: 12, day: 31 };
    }
  }

  assertDomain(
    parts.year >= 1,
    'schedule.invalid-local-date',
    'La date calculée sort de la plage prise en charge.',
    'localDate',
  );
  return formatLocalDate(parts);
}

export function weekdayOfLocalDate(value: string): Weekday {
  const { year, month, day } = parseLocalDate(value, 'localDate');
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4] as const;
  const adjustedYear = month < 3 ? year - 1 : year;
  const sundayBased =
    (adjustedYear +
      Math.floor(adjustedYear / 4) -
      Math.floor(adjustedYear / 100) +
      Math.floor(adjustedYear / 400) +
      (offsets[month - 1] ?? 0) +
      day) %
    7;
  const mondayBased = (sundayBased + 6) % 7;
  return WEEKDAYS[mondayBased] ?? 'mon';
}

export function enumerateLocalDates(fromDate: string, toDate: string): readonly string[] {
  const from = normalizeLocalDate(fromDate, 'fromDate');
  const to = normalizeLocalDate(toDate, 'toDate');
  assertDomain(
    compareLocalDates(from, to) <= 0,
    'occurrence.invalid-generation-window',
    'La fin de la fenêtre doit être postérieure ou égale au début.',
  );

  const dates: string[] = [];
  let current = from;
  while (compareLocalDates(current, to) <= 0) {
    dates.push(current);
    assertDomain(
      dates.length <= 370,
      'occurrence.generation-window-too-large',
      'Une génération ne peut pas dépasser 370 jours.',
    );
    current = addLocalDays(current, 1);
  }
  return dates;
}
