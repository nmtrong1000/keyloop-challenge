import { useQuery } from "@tanstack/react-query";
import { getVehicleActions } from "../dal";

/** Fetched on demand (when a manager expands a vehicle's history), not prefetched for every row on the page. */
export function useVehicleActionsQuery(vehicleId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["vehicle-actions", vehicleId],
    queryFn: () => getVehicleActions(vehicleId),
    enabled,
  });
}
