import { http, HttpResponse } from "msw";
import type { AgeRange, AgingVehicleAction, SortDir, SortField } from "@/shared/types/api";
import { isAgingVehicle } from "@/shared/domain/aging";
import { actionsForVehicle, mostRecentAction } from "@/shared/domain/currentStatus";
import { matchesFilters } from "@/shared/domain/filters";
import { paginate } from "@/shared/domain/pagination";
import { sortVehicles } from "@/shared/domain/sorting";
import { actions, vehicles } from "./fixtures";

const VALID_AGE_RANGES: AgeRange[] = ["0-30", "31-60", "61-90", "90-plus"];
const VALID_SORT_FIELDS: SortField[] = ["make", "model", "intakeDate"];
const VALID_SORT_DIRS: SortDir[] = ["asc", "desc"];

/**
 * Shared handler array — both msw/node (server.ts) and msw/browser (browser.ts)
 * consume this same definition, per SDD §5.3: no duplicated mock logic.
 */
export const handlers = [
  http.get("*/vehicles", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
    const make = url.searchParams.get("make") ?? undefined;
    const model = url.searchParams.get("model") ?? undefined;
    const ageRangeParam = url.searchParams.get("ageRange") ?? undefined;
    const sortByParam = url.searchParams.get("sortBy") ?? undefined;
    const sortDirParam = url.searchParams.get("sortDir") ?? undefined;

    if (ageRangeParam && !VALID_AGE_RANGES.includes(ageRangeParam as AgeRange)) {
      return HttpResponse.json(
        { message: `Invalid ageRange: ${ageRangeParam}` },
        { status: 400 },
      );
    }
    if (sortByParam && !VALID_SORT_FIELDS.includes(sortByParam as SortField)) {
      return HttpResponse.json({ message: `Invalid sortBy: ${sortByParam}` }, { status: 400 });
    }
    if (sortDirParam && !VALID_SORT_DIRS.includes(sortDirParam as SortDir)) {
      return HttpResponse.json({ message: `Invalid sortDir: ${sortDirParam}` }, { status: 400 });
    }
    const ageRange = ageRangeParam as AgeRange | undefined;
    const sortBy = sortByParam as SortField | undefined;
    const sortDir = (sortDirParam as SortDir | undefined) ?? "asc";

    const filtered = vehicles.filter((v) =>
      matchesFilters(v, { make, model, ageRange }),
    );
    const totalCount = filtered.length;
    // Global — unaffected by the active filter (SDD §7).
    const agingCount = vehicles.filter((v) => isAgingVehicle(v.intakeDate)).length;
    const sorted = sortVehicles(filtered, sortBy, sortDir);
    // Denormalized read-side convenience for the aging-stock display — the
    // action log itself remains the source of truth (SDD §3.2, contract description).
    const items = paginate(sorted, page, pageSize).map((v) => {
      const latest = mostRecentAction(v.vin, actions);
      return latest ? { ...v, currentStatus: latest.action } : v;
    });

    return HttpResponse.json({ items, totalCount, agingCount });
  }),

  http.get("*/vehicles/:id/actions", ({ params }) => {
    const id = params.id as string;
    const vehicleExists = vehicles.some((v) => v.vin === id);
    if (!vehicleExists) {
      return HttpResponse.json({ message: `No vehicle with VIN ${id}` }, { status: 404 });
    }
    return HttpResponse.json(actionsForVehicle(id, actions));
  }),

  http.post("*/vehicles/:id/actions", async ({ request, params }) => {
    const id = params.id as string;
    const vehicleExists = vehicles.some((v) => v.vin === id);
    if (!vehicleExists) {
      return HttpResponse.json(
        { message: `No vehicle with VIN ${id}` },
        { status: 404 },
      );
    }

    const body = (await request.json().catch(() => null)) as { action?: unknown } | null;
    if (!body || typeof body.action !== "string" || body.action.trim().length === 0) {
      return HttpResponse.json({ message: "action is required" }, { status: 400 });
    }

    const record: AgingVehicleAction = {
      vehicleId: id,
      action: body.action,
      timestamp: new Date().toISOString(),
    };
    // Append-only — never mutates or overwrites a prior record (SRS FR).
    actions.push(record);

    const correlationId = request.headers.get("X-Correlation-Id");
    return HttpResponse.json(record, {
      status: 201,
      // Echoed back so the trace closes in both directions (SDD §6.3).
      headers: correlationId ? { "X-Correlation-Id": correlationId } : undefined,
    });
  }),
];
