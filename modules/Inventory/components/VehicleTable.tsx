import type { ReactNode } from "react";
import type { Vehicle } from "@/shared/types/api";
import type { SortDir, SortField } from "@/modules/Inventory/types";
import { Table, type Column } from "@/shared/components/Table";

export interface VehicleTableProps {
  vehicles: Vehicle[];
  renderStatus?: (vehicle: Vehicle) => ReactNode;
  renderLog?: (vehicle: Vehicle) => ReactNode;
  renderAction?: (vehicle: Vehicle) => ReactNode;
  sortBy?: SortField;
  sortDir?: SortDir;
  onSort?: (field: SortField) => void;
}

export function VehicleTable({
  vehicles,
  renderStatus,
  renderLog,
  renderAction,
  sortBy,
  sortDir,
  onSort,
}: VehicleTableProps) {
  const columns: Column<Vehicle>[] = [
    { key: "vin", header: "VIN", width: "140px", cellClassName: "font-mono text-label-sm", render: (v) => v.vin },
    { key: "make", header: "Make", width: "150px", sortable: true, render: (v) => v.make },
    { key: "model", header: "Model", width: "120px", sortable: true, render: (v) => v.model },
    { key: "intakeDate", header: "Intake Date", width: "150px", sortable: true, render: (v) => v.intakeDate },
    ...(renderStatus
      ? [{ key: "status", header: "Status", width: "120px", render: renderStatus } satisfies Column<Vehicle>]
      : []),
    ...(renderLog ? [{ key: "log", header: "Log", render: renderLog } satisfies Column<Vehicle>] : []),
    ...(renderAction
      ? [{ key: "action", header: "Action", width: "160px", render: renderAction } satisfies Column<Vehicle>]
      : []),
  ];

  return (
    <Table
      rows={vehicles}
      columns={columns}
      rowKey={(v) => v.vin}
      emptyMessage="No vehicles match the current filters."
      sortBy={sortBy}
      sortDir={sortDir}
      onSort={onSort ? (key) => onSort(key as SortField) : undefined}
    />
  );
}
