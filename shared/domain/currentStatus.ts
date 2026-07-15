import type { AgingVehicleAction } from "@/shared/types/api";

/** Every action for a vehicle, most recent first — not assumed pre-sorted. */
export function actionsForVehicle(
  vehicleId: string,
  actions: AgingVehicleAction[],
): AgingVehicleAction[] {
  return actions
    .filter((a) => a.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/** "Most recent" by timestamp, not array order — the DAL/mock doesn't guarantee pre-sorted actions. */
export function mostRecentAction(
  vehicleId: string,
  actions: AgingVehicleAction[],
): AgingVehicleAction | undefined {
  return actionsForVehicle(vehicleId, actions)[0];
}
