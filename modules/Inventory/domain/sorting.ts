import type { Vehicle } from "@/shared/types/api";
import type { SortDir, SortField } from "@/modules/Inventory/types";

/** Pure comparator — no HTTP handler wiring, mirrors filters.ts/pagination.ts. */
export function sortVehicles(vehicles: Vehicle[], sortBy?: SortField, sortDir: SortDir = "asc"): Vehicle[] {
  if (!sortBy) return vehicles;

  const direction = sortDir === "desc" ? -1 : 1;
  return [...vehicles].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (aValue === bValue) return 0;
    return aValue < bValue ? -direction : direction;
  });
}
