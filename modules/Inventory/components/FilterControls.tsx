"use client";

import type { AgeRange } from "@/modules/Inventory/types";
import { useFilterStore } from "../store/filterStore";
import { Select } from "@/shared/components/elements/Select";

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

export function FilterControls() {
  const filters = useFilterStore((s) => s.filters);
  const setMake = useFilterStore((s) => s.setMake);
  const setModel = useFilterStore((s) => s.setModel);
  const setAgeRange = useFilterStore((s) => s.setAgeRange);

  return (
    <div className="flex flex-wrap gap-4 py-4">
      <Select
        label="Make"
        aria-label="Filter by make"
        value={filters.make}
        onChange={setMake}
        options={MAKE_OPTIONS.map((make) => ({ value: make, label: make }))}
        placeholder="All makes"
      />
      <Select
        label="Model"
        aria-label="Filter by model"
        value={filters.model}
        onChange={setModel}
        options={MODEL_OPTIONS.map((model) => ({ value: model, label: model }))}
        placeholder="All models"
      />
      <Select
        label="Age"
        aria-label="Filter by age"
        value={filters.ageRange}
        onChange={setAgeRange}
        options={AGE_RANGE_OPTIONS}
        placeholder="All ages"
      />
    </div>
  );
}
