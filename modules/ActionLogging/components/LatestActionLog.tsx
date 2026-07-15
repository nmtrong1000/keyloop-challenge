import { isAgingVehicle } from "@/modules/AgingStock";
import type { Vehicle } from "@/shared/types/api";

export function LatestActionLog({ vehicle }: { vehicle: Vehicle }) {
  return (
    <span className="block truncate text-body-sm text-on-surface-variant">
      {isAgingVehicle(vehicle.intakeDate) ? vehicle.currentStatus || "—": "—"}
    </span>
  );
}
