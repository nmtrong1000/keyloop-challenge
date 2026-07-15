"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import type { Vehicle } from "@/shared/types/api";
import { logEvent } from "@/shared/observability/logEvent";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";
import { useFilterStore } from "@/shared/store/filterStore";
import { useVehiclesQuery } from "@/shared/store/useVehiclesQuery";
import { FilterControls } from "../components/FilterControls";
import { PaginationControls } from "../components/PaginationControls";
import { VehicleTable } from "../components/VehicleTable";

export interface InventoryPageProps {
  renderStatus?: (vehicle: Vehicle) => ReactNode;
  renderLog?: (vehicle: Vehicle) => ReactNode;
  renderAction?: (vehicle: Vehicle) => ReactNode;
  renderAgingSummary?: (agingCount: number) => ReactNode;
}

export function InventoryPage({
  renderStatus,
  renderLog,
  renderAction,
  renderAgingSummary,
}: InventoryPageProps) {
  const { data, isLoading, isFetching, isError } = useVehiclesQuery();
  const filters = useFilterStore((s) => s.filters);
  const page = useFilterStore((s) => s.page);
  const pageSize = useFilterStore((s) => s.pageSize);
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
    performance.mark("inventory-render-start");
  }, [data]);
  useEffect(() => {
    if (!data) return;
    performance.mark("inventory-render-end");
    performance.measure("inventory-render", "inventory-render-start", "inventory-render-end");
  }, [data]);

  if (isLoading) {
    return (
      <p className="py-8 text-center text-body-md text-on-surface-variant">Loading vehicles…</p>
    );
  }
  if (isError || !data) {
    return <p className="py-8 text-center text-body-md text-error">Failed to load vehicles.</p>;
  }

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
      <PaginationControls totalCount={data.totalCount} />
    </div>
  );
}
