import type { SortDir, SortField } from "@/shared/types/api";
import type { VehicleFilterSelection } from "./filterStore";

export const vehiclesQueryKey = (
  page: number,
  pageSize: number,
  filters: VehicleFilterSelection,
  sortBy?: SortField,
  sortDir?: SortDir,
) => ["vehicles", page, pageSize, filters, sortBy, sortDir] as const;
