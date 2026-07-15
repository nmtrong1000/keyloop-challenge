import { isAgingVehicle } from "@/shared/domain/aging";
import type { Vehicle } from "@/shared/types/api";

export function AgingBadge({ vehicle }: { vehicle: Vehicle }) {
  if (!isAgingVehicle(vehicle.intakeDate)) return null;

  return (
    <span className="inline-flex w-fit items-center rounded bg-amber-100 px-2 py-0.5 font-mono text-label-sm text-amber-900">
      Aging Stock
    </span>
  );
}
