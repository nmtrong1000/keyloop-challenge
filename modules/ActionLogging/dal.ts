import type { AgingVehicleAction } from "@/shared/types/api";
import { request } from "@/shared/http";

/** Typed client for GET /vehicles/:id/actions — full history, most recent first. */
export async function getVehicleActions(vehicleId: string): Promise<AgingVehicleAction[]> {
  return request<AgingVehicleAction[]>(`/vehicles/${encodeURIComponent(vehicleId)}/actions`);
}

export interface PostVehicleActionOptions {
  correlationId?: string;
}

/** Typed client for POST /vehicles/:id/actions — forwards correlationId as X-Correlation-Id (SDD §6.3). */
export async function postVehicleAction(
  vehicleId: string,
  action: string,
  options: PostVehicleActionOptions = {},
): Promise<AgingVehicleAction> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.correlationId) headers["X-Correlation-Id"] = options.correlationId;

  return request<AgingVehicleAction>(`/vehicles/${encodeURIComponent(vehicleId)}/actions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action }),
  });
}
