import { Field } from '../../components/primitives/Field';
import { dayMomentLabels, validationLabels } from '../../content/copy/labels';
import type { DayMoment, ValidationMode, Weekday } from '../../domain/shared/types';
import type { ScheduleDraft } from './ScheduleDraft';

const weekdayOptions: readonly { id: Weekday; label: string }[] = [
  { id: 'mon', label: 'Lun' }, { id: 'tue', label: 'Mar' }, { id: 'wed', label: 'Mer' },
  { id: 'thu', label: 'Jeu' }, { id: 'fri', label: 'Ven' }, { id: 'sat', label: 'Sam' }, { id: 'sun', label: 'Dim' },
];

export function ScheduleDraftFields({ draft, childOptions, onChange }: { readonly draft: ScheduleDraft; readonly childOptions: readonly { readonly id: string; readonly label: string }[]; readonly onChange: (draft: ScheduleDraft) => void; }) {
  function toggle<T extends string>(value: T, values: readonly T[]): readonly T[] { return values.includes(value) ? values.filter((candidate) => candidate !== value) : [...values, value]; }
  return <>
    <fieldset className="choice-grid"><legend>Enfants concernés</legend>{childOptions.map((child) => <label key={child.id}><input type="checkbox" checked={draft.childIds.includes(child.id)} onChange={() => onChange({ ...draft, childIds: toggle(child.id, draft.childIds) })} />{child.label}</label>)}</fieldset>
    <Field label="Quand ?"><select value={draft.kind} onChange={(event) => onChange({ ...draft, kind: event.target.value as ScheduleDraft['kind'] })}><option value="immediate">Maintenant</option><option value="one-off">À une date</option><option value="weekly">Chaque semaine</option></select></Field>
    {draft.kind !== 'immediate' && <Field label="Date de départ"><input type="date" value={draft.startDate} onChange={(event) => onChange({ ...draft, startDate: event.target.value })} required /></Field>}
    {draft.kind === 'weekly' && <><fieldset className="weekday-picker"><legend>Jours</legend>{weekdayOptions.map((weekday) => <label key={weekday.id}><input type="checkbox" checked={draft.weekdays.includes(weekday.id)} onChange={() => onChange({ ...draft, weekdays: toggle(weekday.id, draft.weekdays) })} />{weekday.label}</label>)}</fieldset><Field label="Date de fin facultative"><input type="date" value={draft.endDate} min={draft.startDate} onChange={(event) => onChange({ ...draft, endDate: event.target.value })} /></Field></>}
    <Field label="Moment"><select value={draft.dayMoment} onChange={(event) => onChange({ ...draft, dayMoment: event.target.value as DayMoment })}>{Object.entries(dayMomentLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
    <Field label="Heure facultative"><input type="time" value={draft.exactTime} onChange={(event) => onChange({ ...draft, exactTime: event.target.value })} /></Field>
    <Field label="Validation"><select value={draft.validationMode} onChange={(event) => onChange({ ...draft, validationMode: event.target.value as ValidationMode })}>{Object.entries(validationLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></Field>
    <Field label="Type"><select value={draft.priority} onChange={(event) => onChange({ ...draft, priority: event.target.value as ScheduleDraft['priority'] })}><option value="required">Proposée en priorité</option><option value="optional">Facultative</option></select></Field>
  </>;
}
