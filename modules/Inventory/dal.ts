import type { PagedVehicles } from "@/shared/types/api";
import type { SortDir, SortField, VehicleFilters } from "@/modules/Inventory/types";
import { request } from "@/shared/http";

export interface GetVehiclesParams {
  page?: number;
  pageSize?: number;
  filters?: VehicleFilters;
  sortBy?: SortField;
  sortDir?: SortDir;
}

/** Typed client for GET /vehicles — framework-agnostic, no React hooks (the state layer wraps this). */
export async function getVehicles(params: GetVehiclesParams = {}): Promise<PagedVehicles> {
  const { page = 1, pageSize = 20, filters = {}, sortBy, sortDir } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));
  if (filters.make) searchParams.set("make", filters.make);
  if (filters.model) searchParams.set("model", filters.model);
  if (filters.ageRange) searchParams.set("ageRange", filters.ageRange);
  if (sortBy) searchParams.set("sortBy", sortBy);
  if (sortBy && sortDir) searchParams.set("sortDir", sortDir);

  return request<PagedVehicles>(`/vehicles?${searchParams}`);
}
