export interface Clock {
  nowIso(): string;
  todayLocal(): string;
}
