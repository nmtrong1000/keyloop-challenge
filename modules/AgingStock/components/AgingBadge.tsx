import { isAgingVehicle } from "../domain/aging";
import type { Vehicle } from "@/shared/types/api";
import { Badge } from "@/shared/components/Badge";

export function AgingBadge({ vehicle }: { vehicle: Vehicle }) {
  if (!isAgingVehicle(vehicle.intakeDate)) return null;

  return <Badge tone="amber">Aging Stock</Badge>;
}
