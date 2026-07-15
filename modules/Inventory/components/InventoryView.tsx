"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import type { Vehicle } from "@/shared/types/api";
import { logEvent } from "@/shared/observability/logEvent";
import { markEnd, markStart } from "@/shared/observability/measure";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { useFilterStore } from "../store/filterStore";
import { useVehiclesQuery } from "../hooks/useVehiclesQuery";
import { FilterControls } from "./FilterControls";
import { VehicleTable } from "./VehicleTable";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500];

export interface InventoryViewProps {
  renderStatus?: (vehicle: Vehicle) => ReactNode;
  renderLog?: (vehicle: Vehicle) => ReactNode;
  renderAction?: (vehicle: Vehicle) => ReactNode;
  renderAgingSummary?: (agingCount: number) => ReactNode;
}

export function InventoryView({
  renderStatus,
  renderLog,
  renderAction,
  renderAgingSummary,
}: InventoryViewProps) {
  const { data, isLoading, isFetching, isError } = useVehiclesQuery();
  const filters = useFilterStore((s) => s.filters);
  const page = useFilterStore((s) => s.page);
  const pageSize = useFilterStore((s) => s.pageSize);
  const setPage = useFilterStore((s) => s.setPage);
  const setPageSize = useFilterStore((s) => s.setPageSize);
  const sortBy = useFilterStore((s) => s.sortBy);
  const sortDir = useFilterStore((s) => s.sortDir);
  const setSort = useFilterStore((s) => s.setSort);

  const hasLoggedView = useRef(false);
  const previousFilters = useRef(filters);

  useEffect(() => {
    if (!data || hasLoggedView.current) return;
    hasLoggedView.current = true;
    logEvent("inventory.viewed", { page, pageSize, count: data.items.length });
  }, [data, page, pageSize]);

  useEffect(() => {
    if (previousFilters.current === filters) return;
    previousFilters.current = filters;
    logEvent("inventory.filtered", { ...filters });
  }, [filters]);

  useLayoutEffect(() => {
    if (!data) return;
    markStart("inventory-render");
  }, [data]);
  useEffect(() => {
    if (!data) return;
    markEnd("inventory-render");
  }, [data]);

  if (isLoading) {
    return (
      <p className="py-8 text-center text-body-md text-on-surface-variant">Loading vehicles…</p>
    );
  }
  if (isError || !data) {
    return <p className="py-8 text-center text-body-md text-error">Failed to load vehicles.</p>;
  }

  const totalPages = Math.max(1, Math.ceil(data.totalCount / pageSize));

  return (
    <div>
      {renderAgingSummary ? renderAgingSummary(data.agingCount) : null}
      <FilterControls />
      <div className="relative">
        <VehicleTable
          vehicles={data.items}
          renderStatus={renderStatus}
          renderLog={renderLog}
          renderAction={renderAction}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={setSort}
        />
        {isFetching ? <LoadingOverlay /> : null}
      </div>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
