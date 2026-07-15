export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string | number> {
  label: string;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  options: SelectOption<T>[];
  /** Omit for a select that should never be empty (e.g. page size). */
  placeholder?: string;
  "aria-label"?: string;
}

const selectClassName =
  "cursor-pointer rounded border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-sm text-on-surface focus:border-secondary focus:outline-none";
const labelClassName = "flex items-center gap-2 font-mono text-label-md text-on-surface-variant";

export function Select<T extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder,
  "aria-label": ariaLabel,
}: SelectProps<T>) {
  return (
    <label className={labelClassName}>
      {label}
      <select
        aria-label={ariaLabel ?? label}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (!raw) return onChange(undefined);
          onChange(options.find((opt) => String(opt.value) === raw)?.value);
        }}
        className={selectClassName}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
