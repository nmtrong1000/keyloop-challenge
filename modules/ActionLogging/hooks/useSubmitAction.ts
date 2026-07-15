import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VEHICLES_QUERY_KEY } from "@/modules/Inventory";
import { postVehicleAction } from "../dal";
import { logEvent } from "@/shared/observability/logEvent";
import { generateCorrelationId } from "@/shared/observability/correlationId";

export interface SubmitActionInput {
  vehicleId: string;
  action: string;
}

/**
 * Mutate-then-invalidate (SDD §5.3): a successful submission invalidates
 * both the vehicles query (the aging-stock current-status badge) and this
 * vehicle's action-history query, so neither needs a manual refresh.
 *
 * Generates the correlation ID here (generateCorrelationId(), SDD §6.3) and
 * fires `aging_vehicle.action_logged` on success — logging and tracing
 * live here, at the point where the DAL mutation happens.
 */
export function useSubmitAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, action }: SubmitActionInput) => {
      const correlationId = generateCorrelationId();
      const record = await postVehicleAction(vehicleId, action, { correlationId });
      return { record, correlationId };
    },
    onSuccess: ({ correlationId }, { vehicleId, action }) => {
      logEvent("aging_vehicle.action_logged", { vehicleId, action, correlationId });
      queryClient.invalidateQueries({ queryKey: [VEHICLES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-actions", vehicleId] });
    },
  });
}
