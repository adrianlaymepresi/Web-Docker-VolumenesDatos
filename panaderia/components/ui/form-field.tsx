import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export const controlClassName =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/70 transition-colors focus:border-secondary focus:outline-none focus-visible:outline-2 focus-visible:outline-secondary aria-invalid:border-danger";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-text">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-xs font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string) {
  return error ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; error?: string; hint?: string };

export function TextInput({ label, id, error, hint, className = "", ...props }: TextInputProps) {
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <input id={id} name={id} className={`${controlClassName} ${className}`} {...describedBy(id, error)} {...props} />
    </FormField>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; id: string; error?: string };

export function TextArea({ label, id, error, className = "", ...props }: TextAreaProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <textarea id={id} name={id} rows={3} className={`${controlClassName} resize-y ${className}`} {...describedBy(id, error)} {...props} />
    </FormField>
  );
}

type SelectOption = { value: string; label: string };

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  id: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function SelectInput({ label, id, error, options, placeholder, className = "", ...props }: SelectInputProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <select id={id} name={id} className={`${controlClassName} ${className}`} {...describedBy(id, error)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
