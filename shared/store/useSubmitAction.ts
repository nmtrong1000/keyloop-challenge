import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postVehicleAction } from "@/shared/dal";
import { logEvent } from "@/shared/observability/logEvent";

export interface SubmitActionInput {
  vehicleId: string;
  action: string;
}

/**
 * Mutate-then-invalidate (SDD §5.3): a successful submission invalidates
 * both the vehicles query (the aging-stock current-status badge) and this
 * vehicle's action-history query, so neither needs a manual refresh.
 *
 * Generates the correlation ID here (crypto.randomUUID(), SDD §6.3) and
 * fires `aging_vehicle.action_logged` on success — logging and tracing
 * live here, at the point where the DAL mutation happens.
 */
export function useSubmitAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, action }: SubmitActionInput) => {
      const correlationId = crypto.randomUUID();
      const record = await postVehicleAction(vehicleId, action, { correlationId });
      return { record, correlationId };
    },
    onSuccess: ({ correlationId }, { vehicleId, action }) => {
      logEvent("aging_vehicle.action_logged", { vehicleId, action, correlationId });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-actions", vehicleId] });
    },
  });
}
