import type { ReactNode } from 'react';

interface FieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
      {hint !== undefined && <span className="field__hint">{hint}</span>}
    </label>
  );
}
