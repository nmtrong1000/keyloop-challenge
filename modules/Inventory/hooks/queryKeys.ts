import type { SortDir, SortField, VehicleFilters } from "@/modules/Inventory/types";

export const VEHICLES_QUERY_KEY = "vehicles";

export const vehiclesQueryKey = (
  page: number,
  pageSize: number,
  filters: VehicleFilters,
  sortBy?: SortField,
  sortDir?: SortDir,
) => [VEHICLES_QUERY_KEY, page, pageSize, filters, sortBy, sortDir] as const;
