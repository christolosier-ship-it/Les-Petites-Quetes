import { useState, type FormEvent } from 'react';
import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { Button } from '../../components/primitives/Button';
import { Field } from '../../components/primitives/Field';
import { dayMomentLabels, validationLabels } from '../../content/copy/labels';
import type { QuestTemplate } from '../../domain/quest/QuestTemplate';
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
  readonly onDone: () => void;
}

export function QuestScheduleForm({ app, template, onDone }: QuestScheduleFormProps) {
  const activeChildren = app.state.children.filter((child) => !child.isArchived && child.deletedAt === undefined);
  const [childId, setChildId] = useState(app.state.settings.activeChildId ?? activeChildren[0]?.id ?? '');
  const [kind, setKind] = useState<'immediate' | 'one-off' | 'weekly'>('immediate');
  const [startDate, setStartDate] = useState(clock.todayLocal());
  const [weekdays, setWeekdays] = useState<readonly Weekday[]>(['mon']);
  const [dayMoment, setDayMoment] = useState<DayMoment>('anytime');
  const [validationMode, setValidationMode] = useState<ValidationMode>(template.defaultValidation);
  const [priority, setPriority] = useState<'required' | 'optional'>('required');

  function toggleWeekday(weekday: Weekday) {
    setWeekdays((current) => current.includes(weekday)
      ? current.filter((candidate) => candidate !== weekday)
      : [...current, weekday]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    await app.createSchedule({
      questTemplateId: template.id,
      childIds: [childId],
      kind,
      startDate: kind === 'immediate' ? clock.todayLocal() : startDate,
      ...(kind === 'weekly' ? { weekdays } : {}),
      dayMoment,
      priority,
      validationMode,
    });
    onDone();
  }

  if (activeChildren.length === 0) return <p>Crée d’abord un profil enfant.</p>;

  return (
    <form className="form-grid" onSubmit={(event) => void submit(event)}>
      <Field label="Enfant">
        <select value={childId} onChange={(event) => setChildId(event.target.value)}>
          {activeChildren.map((child) => <option key={child.id} value={child.id}>{child.displayName}</option>)}
        </select>
      </Field>
      <Field label="Quand ?">
        <select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}>
          <option value="immediate">Disponible maintenant</option>
          <option value="one-off">À une date</option>
          <option value="weekly">Chaque semaine</option>
        </select>
      </Field>
      {kind !== 'immediate' && <Field label="Date de départ"><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></Field>}
      {kind === 'weekly' && (
        <fieldset className="weekday-picker">
          <legend>Jours</legend>
          {weekdayOptions.map((weekday) => (
            <label key={weekday.id}><input type="checkbox" checked={weekdays.includes(weekday.id)} onChange={() => toggleWeekday(weekday.id)} />{weekday.label}</label>
          ))}
        </fieldset>
      )}
      <Field label="Moment">
        <select value={dayMoment} onChange={(event) => setDayMoment(event.target.value as DayMoment)}>
          {Object.entries(dayMomentLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </Field>
      <Field label="Validation">
        <select value={validationMode} onChange={(event) => setValidationMode(event.target.value as ValidationMode)}>
          {Object.entries(validationLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </Field>
      <Field label="Type">
        <select value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)}>
          <option value="required">Proposée en priorité</option><option value="optional">Facultative</option>
        </select>
      </Field>
      <div className="button-row"><Button type="submit">Ajouter la quête</Button><Button variant="quiet" onClick={onDone}>Annuler</Button></div>
    </form>
  );
}
