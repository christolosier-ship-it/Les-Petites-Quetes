import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Field } from '../../components/primitives/Field';
import { dayMomentLabels, validationLabels } from '../../content/copy/labels';
import type { QuestTemplate } from '../../domain/quest/QuestTemplate';
import type { QuestSchedule } from '../../domain/schedule/QuestSchedule';
import type { DayMoment, ValidationMode, Weekday } from '../../domain/shared/types';
import { SystemClock } from '../../platform/clock/SystemClock';

const clock = new SystemClock();
const weekdayOptions: readonly { id: Weekday; label: string }[] = [
  { id: 'mon', label: 'Lun' }, { id: 'tue', label: 'Mar' }, { id: 'wed', label: 'Mer' },
  { id: 'thu', label: 'Jeu' }, { id: 'fri', label: 'Ven' }, { id: 'sat', label: 'Sam' },
  { id: 'sun', label: 'Dim' },
];

interface QuestScheduleFormProps {
  readonly app: FamilyAppController;
  readonly template: QuestTemplate;
  readonly existingSchedule?: QuestSchedule;
  readonly onDone: () => void;
}

export function QuestScheduleForm({ app, template, existingSchedule, onDone }: QuestScheduleFormProps) {
  const activeChildren = app.state.children.filter((child) => !child.isArchived && child.deletedAt === undefined);
  const defaultChildIds = existingSchedule?.childIds ?? [app.state.settings.activeChildId ?? activeChildren[0]?.id ?? ''];
  const [childIds, setChildIds] = useState<readonly string[]>(defaultChildIds.filter(Boolean));
  const [kind, setKind] = useState<'immediate' | 'one-off' | 'weekly'>(existingSchedule?.kind ?? 'immediate');
  const [startDate, setStartDate] = useState(existingSchedule?.startDate ?? clock.todayLocal());
  const [endDate, setEndDate] = useState(existingSchedule?.endDate ?? '');
  const [weekdays, setWeekdays] = useState<readonly Weekday[]>(existingSchedule?.weekdays ?? ['mon']);
  const [dayMoment, setDayMoment] = useState<DayMoment>(existingSchedule?.dayMoment ?? 'anytime');
  const [exactTime, setExactTime] = useState(existingSchedule?.exactTime ?? '');
  const [validationMode, setValidationMode] = useState<ValidationMode>(existingSchedule?.validationMode ?? template.defaultValidation);
  const [priority, setPriority] = useState<'required' | 'optional'>(existingSchedule?.priority ?? 'required');
  const [message, setMessage] = useState('');

  function toggleValue<T extends string>(value: T, values: readonly T[], update: (next: readonly T[]) => void) {
    update(values.includes(value) ? values.filter((candidate) => candidate !== value) : [...values, value]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    if (childIds.length === 0) {
      setMessage('Choisis au moins un enfant.');
      return;
    }
    try {
      const input = {
        questTemplateId: template.id,
        childIds,
        kind,
        startDate: kind === 'immediate' ? clock.todayLocal() : startDate,
        ...(kind === 'weekly' && endDate !== '' ? { endDate } : {}),
        ...(kind === 'weekly' ? { weekdays } : {}),
        dayMoment,
        ...(exactTime !== '' ? { exactTime } : {}),
        priority,
        validationMode,
      } as const;
      if (existingSchedule) await app.replaceSchedule(existingSchedule.id, input);
      else await app.createSchedule(input);
      onDone();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Planification impossible.');
    }
  }

  if (activeChildren.length === 0) return <p>Crée d’abord un profil enfant.</p>;

  return (
    <form className="form-grid" onSubmit={(event) => void submit(event)}>
      <fieldset className="choice-grid"><legend>Enfants concernés</legend>{activeChildren.map((child) => <label key={child.id}><input type="checkbox" checked={childIds.includes(child.id)} onChange={() => toggleValue(child.id, childIds, setChildIds)} />{child.displayName}</label>)}</fieldset>
      <Field label="Quand ?"><select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="immediate">Disponible maintenant</option><option value="one-off">À une date</option><option value="weekly">Chaque semaine</option></select></Field>
      {kind !== 'immediate' && <Field label="Date de départ"><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></Field>}
      {kind === 'weekly' && <><fieldset className="weekday-picker"><legend>Jours</legend>{weekdayOptions.map((weekday) => <label key={weekday.id}><input type="checkbox" checked={weekdays.includes(weekday.id)} onChange={() => toggleValue(weekday.id, weekdays, setWeekdays)} />{weekday.label}</label>)}</fieldset><Field label="Date de fin facultative"><input type="date" value={endDate} min={startDate} onChange={(event) => setEndDate(event.target.value)} /></Field></>}
      <Field label="Moment"><select value={dayMoment} onChange={(event) => setDayMoment(event.target.value as DayMoment)}>{Object.entries(dayMomentLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
      <Field label="Heure facultative"><input type="time" value={exactTime} onChange={(event) => setExactTime(event.target.value)} /></Field>
      <Field label="Validation"><select value={validationMode} onChange={(event) => setValidationMode(event.target.value as ValidationMode)}>{Object.entries(validationLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
      <Field label="Type"><select value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)}><option value="required">Proposée en priorité</option><option value="optional">Facultative</option></select></Field>
      {message && <p className="form-message" role="alert">{message}</p>}
      <div className="button-row"><Button type="submit">{existingSchedule ? 'Remplacer la routine' : 'Ajouter la quête'}</Button><Button variant="quiet" onClick={onDone}>Annuler</Button></div>
    </form>
  );
}
