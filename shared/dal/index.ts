import type {
  AgeRange,
  AgingVehicleAction,
  PagedVehicles,
  SortDir,
  SortField,
} from "@/shared/types/api";

export class DataAccessError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DataAccessError";
    this.status = status;
  }
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

async function parseErrorMessage(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  return body?.message ?? res.statusText;
}

export interface GetVehiclesParams {
  page?: number;
  pageSize?: number;
  filters?: { make?: string; model?: string; ageRange?: AgeRange };
  sortBy?: SortField;
  sortDir?: SortDir;
}

/** Typed client for GET /vehicles — framework-agnostic, no React hooks (the state layer wraps this). */
export async function getVehicles(params: GetVehiclesParams = {}): Promise<PagedVehicles> {
  const { page = 1, pageSize = 20, filters = {}, sortBy, sortDir } = params;
  const url = new URL("/vehicles", getBaseUrl());
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  if (filters.make) url.searchParams.set("make", filters.make);
  if (filters.model) url.searchParams.set("model", filters.model);
  if (filters.ageRange) url.searchParams.set("ageRange", filters.ageRange);
  if (sortBy) url.searchParams.set("sortBy", sortBy);
  if (sortBy && sortDir) url.searchParams.set("sortDir", sortDir);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new DataAccessError(await parseErrorMessage(res), res.status);
  }
  return (await res.json()) as PagedVehicles;
}

/** Typed client for GET /vehicles/:id/actions — full history, most recent first. */
export async function getVehicleActions(vehicleId: string): Promise<AgingVehicleAction[]> {
  const url = new URL(`/vehicles/${encodeURIComponent(vehicleId)}/actions`, getBaseUrl());
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new DataAccessError(await parseErrorMessage(res), res.status);
  }
  return (await res.json()) as AgingVehicleAction[];
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
  const url = new URL(`/vehicles/${encodeURIComponent(vehicleId)}/actions`, getBaseUrl());
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.correlationId) headers["X-Correlation-Id"] = options.correlationId;

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify({ action }),
  });
  if (!res.ok) {
    throw new DataAccessError(await parseErrorMessage(res), res.status);
  }
  return (await res.json()) as AgingVehicleAction;
}
