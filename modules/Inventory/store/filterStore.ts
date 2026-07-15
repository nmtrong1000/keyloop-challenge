import { create } from "zustand";
import type { AgeRange, SortDir, SortField, VehicleFilters } from "@/modules/Inventory/types";
import { PAGE_SIZE } from "@/shared/constants";

interface FilterState {
  page: number;
  pageSize: number;
  filters: VehicleFilters;
  sortBy?: SortField;
  sortDir: SortDir;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setMake: (make: string | undefined) => void;
  setModel: (model: string | undefined) => void;
  setAgeRange: (ageRange: AgeRange | undefined) => void;
  setSort: (field: SortField) => void;
}

/** Client-only UI state: the *selected* filters, page, page size, and sort — not the matching/sorting logic (that's server-side). */
export const useFilterStore = create<FilterState>((set) => ({
  page: 1,
  pageSize: PAGE_SIZE,
  filters: {},
  sortBy: undefined,
  sortDir: "asc",
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  setMake: (make) => set((s) => ({ filters: { ...s.filters, make }, page: 1 })),
  setModel: (model) => set((s) => ({ filters: { ...s.filters, model }, page: 1 })),
  setAgeRange: (ageRange) => set((s) => ({ filters: { ...s.filters, ageRange }, page: 1 })),
  setSort: (field) =>
    set((s) => ({
      sortBy: field,
      sortDir: s.sortBy === field && s.sortDir === "asc" ? "desc" : "asc",
      page: 1,
    })),
}));
