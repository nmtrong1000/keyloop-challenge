import type { ReactNode } from "react";
import type { SortDir, SortField, Vehicle } from "@/shared/types/api";

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
  if (vehicles.length === 0) {
    return (
      <p className="py-8 text-center text-body-md text-on-surface-variant">
        No vehicles match the current filters.
      </p>
    );
  }

  function sortableHeader(field: SortField, label: string) {
    if (!onSort) return label;
    const ascActive = sortBy === field && sortDir === "asc";
    const descActive = sortBy === field && sortDir === "desc";
    return (
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex cursor-pointer items-center gap-1 hover:text-on-surface"
      >
        {label}
        <span aria-hidden="true" className="flex flex-col text-[7px] gap-[2px] leading-none">
          <span className={ascActive ? "text-on-surface" : "text-on-surface-variant/40"}>▲</span>
          <span className={descActive ? "text-on-surface" : "text-on-surface-variant/40"}>▼</span>
        </span>
      </button>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-outline-variant bg-surface-container-lowest">
      <table className="w-full table-fixed text-left text-body-sm">
        <colgroup>
          <col className="w-[140px]" />
          <col className="w-[150px]" />
          <col className="w-[120px]" />
          <col className="w-[150px]" />
          {renderStatus ? <col className="w-[120px]" /> : null}
          {renderLog ? <col /> : null}
          {renderAction ? <col className="w-[160px]" /> : null}
        </colgroup>
        <thead>
          <tr className="border-b border-outline-variant font-mono text-label-md font-bold text-on-surface-variant">
            <th className="p-2">VIN</th>
            <th className="p-2">{sortableHeader("make", "Make")}</th>
            <th className="p-2">{sortableHeader("model", "Model")}</th>
            <th className="p-2">{sortableHeader("intakeDate", "Intake Date")}</th>
            {renderStatus ? <th className="p-2">Status</th> : null}
            {renderLog ? <th className="p-2">Log</th> : null}
            {renderAction ? <th className="p-2">Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.vin} className="border-b border-outline-variant hover:bg-surface-container-low">
              <td className="truncate p-2 align-top font-mono text-label-sm">{vehicle.vin}</td>
              <td className="truncate p-2 align-top">{vehicle.make}</td>
              <td className="truncate p-2 align-top">{vehicle.model}</td>
              <td className="truncate p-2 align-top">{vehicle.intakeDate}</td>
              {renderStatus ? (
                <td className="truncate p-2 align-top">{renderStatus(vehicle)}</td>
              ) : null}
              {renderLog ? <td className="truncate p-2 align-top">{renderLog(vehicle)}</td> : null}
              {renderAction ? (
                <td className="truncate p-2 align-top">{renderAction(vehicle)}</td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
