import type { AgeRange, Vehicle } from "@/shared/types/api";
import { daysInInventory } from "./aging";

export interface VehicleFilters {
  make?: string;
  model?: string;
  ageRange?: AgeRange;
}

function matchesAgeRange(days: number, ageRange: AgeRange): boolean {
  switch (ageRange) {
    case "0-30":
      return days >= 0 && days <= 30;
    case "31-60":
      return days >= 31 && days <= 60;
    case "61-90":
      return days >= 61 && days <= 90;
    case "90-plus":
      return days > 90;
  }
}

/** Pure predicate — no HTTP handler wiring. */
export function matchesFilters(
  vehicle: Vehicle,
  filters: VehicleFilters,
  today: Date = new Date(),
): boolean {
  if (filters.make && vehicle.make !== filters.make) return false;
  if (filters.model && vehicle.model !== filters.model) return false;
  if (filters.ageRange) {
    const days = daysInInventory(vehicle.intakeDate, today);
    if (!matchesAgeRange(days, filters.ageRange)) return false;
  }
  return true;
}
