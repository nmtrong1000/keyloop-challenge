"use client";

import type { AgeRange } from "@/shared/types/api";
import { useFilterStore } from "@/shared/store/filterStore";

const MAKE_OPTIONS = [
  "Honda",
  "Toyota",
  "Ford",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Hyundai",
  "Kia",
  "Volkswagen",
];

const MODEL_OPTIONS = [
  "Accord",
  "Civic",
  "Camry",
  "Corolla",
  "F-150",
  "Escape",
  "Silverado",
  "Malibu",
  "Altima",
  "Rogue",
  "3 Series",
  "C-Class",
  "Elantra",
  "Sportage",
  "Jetta",
];

const AGE_RANGE_OPTIONS: Array<{ value: AgeRange; label: string }> = [
  { value: "0-30", label: "0-30 days" },
  { value: "31-60", label: "31-60 days" },
  { value: "61-90", label: "61-90 days" },
  { value: "90-plus", label: ">90 days (aging stock)" },
];

const selectClassName =
  "rounded border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-sm text-on-surface focus:border-secondary focus:outline-none";

const labelClassName = "flex flex-col gap-1 font-mono text-label-sm text-on-surface-variant";

export function FilterControls() {
  const filters = useFilterStore((s) => s.filters);
  const setMake = useFilterStore((s) => s.setMake);
  const setModel = useFilterStore((s) => s.setModel);
  const setAgeRange = useFilterStore((s) => s.setAgeRange);

  return (
    <div className="flex flex-wrap gap-4 py-4">
      <label className={labelClassName}>
        Make
        <select
          aria-label="Filter by make"
          value={filters.make ?? ""}
          onChange={(e) => setMake(e.target.value || undefined)}
          className={selectClassName}
        >
          <option value="">All makes</option>
          {MAKE_OPTIONS.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClassName}>
        Model
        <select
          aria-label="Filter by model"
          value={filters.model ?? ""}
          onChange={(e) => setModel(e.target.value || undefined)}
          className={selectClassName}
        >
          <option value="">All models</option>
          {MODEL_OPTIONS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClassName}>
        Age
        <select
          aria-label="Filter by age"
          value={filters.ageRange ?? ""}
          onChange={(e) => setAgeRange((e.target.value || undefined) as AgeRange | undefined)}
          className={selectClassName}
        >
          <option value="">All ages</option>
          {AGE_RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
