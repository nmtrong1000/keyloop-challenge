/**
 * Runs under the "node" Jest project (jest.config.node.ts).
 * Exercises the shared handler definition via msw/node's setupServer.
 * Both msw/node and msw/browser consume the same handlers (SDD §5.3), so
 * this validates the mock's behavior for both entry points; the real
 * Service Worker registration path is verified in the Playwright
 * suite, since jsdom can't run one.
 */
import { server } from "../server";
import { actions, vehicles } from "../fixtures";
import type { PagedVehicles, AgingVehicleAction } from "@/shared/types/api";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("GET /vehicles", () => {
  it("returns a page of vehicles with totalCount and agingCount", async () => {
    const res = await fetch("http://localhost/vehicles?page=1&pageSize=10");
    expect(res.status).toBe(200);
    const body = (await res.json()) as PagedVehicles;
    expect(body.items).toHaveLength(10);
    expect(body.totalCount).toBe(vehicles.length);
    expect(body.agingCount).toBeGreaterThan(0);
  });

  it("returns a different page for page=2", async () => {
    const page1 = await (
      await fetch("http://localhost/vehicles?page=1&pageSize=5")
    ).json() as PagedVehicles;
    const page2 = await (
      await fetch("http://localhost/vehicles?page=2&pageSize=5")
    ).json() as PagedVehicles;
    expect(page2.items[0].vin).not.toBe(page1.items[0].vin);
  });

  it("filters by make server-side, scoping totalCount but not agingCount", async () => {
    const all = await (await fetch("http://localhost/vehicles?pageSize=1")).json() as PagedVehicles;
    const filtered = await (
      await fetch("http://localhost/vehicles?make=Honda&pageSize=1")
    ).json() as PagedVehicles;
    expect(filtered.totalCount).toBeLessThan(all.totalCount);
    expect(filtered.agingCount).toBe(all.agingCount);
  });

  it("rejects an invalid ageRange with 400", async () => {
    const res = await fetch("http://localhost/vehicles?ageRange=not-a-range");
    expect(res.status).toBe(400);
  });

  it("sorts by make ascending, applied before pagination", async () => {
    const body = (await (
      await fetch("http://localhost/vehicles?sortBy=make&pageSize=500")
    ).json()) as PagedVehicles;
    const makes = body.items.map((v) => v.make);
    expect(makes).toEqual([...makes].sort());
  });

  it("sorts by make descending", async () => {
    const body = (await (
      await fetch("http://localhost/vehicles?sortBy=make&sortDir=desc&pageSize=500")
    ).json()) as PagedVehicles;
    const makes = body.items.map((v) => v.make);
    expect(makes).toEqual([...makes].sort().reverse());
  });

  it("rejects an invalid sortBy with 400", async () => {
    const res = await fetch("http://localhost/vehicles?sortBy=vin");
    expect(res.status).toBe(400);
  });

  it("rejects an invalid sortDir with 400", async () => {
    const res = await fetch("http://localhost/vehicles?sortBy=make&sortDir=sideways");
    expect(res.status).toBe(400);
  });

  it("denormalizes currentStatus from the most recent action, when one exists", async () => {
    // Fixture seeds one action every 90th vehicle (see fixtures.ts).
    const body = (await (
      await fetch("http://localhost/vehicles?page=1&pageSize=1")
    ).json()) as PagedVehicles;
    expect(body.items[0].currentStatus).toBe("Price Reduction Planned");
  });

  it("omits currentStatus for a vehicle with no logged actions", async () => {
    const body = (await (
      await fetch("http://localhost/vehicles?page=1&pageSize=2")
    ).json()) as PagedVehicles;
    expect(body.items[1].currentStatus).toBeUndefined();
  });
});

describe("GET /vehicles/:id/actions", () => {
  it("returns the vehicle's action history, most recent first", async () => {
    const vin = vehicles[0].vin; // seeded with one action, see fixtures.ts
    const res = await fetch(`http://localhost/vehicles/${vin}/actions`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as AgingVehicleAction[];
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].vehicleId).toBe(vin);
  });

  it("returns an empty array for a vehicle with no logged actions", async () => {
    const vin = vehicles[1].vin; // not a multiple of 90, no seeded action
    const res = await fetch(`http://localhost/vehicles/${vin}/actions`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns 404 for an unknown vehicle", async () => {
    const res = await fetch("http://localhost/vehicles/UNKNOWN-VIN/actions");
    expect(res.status).toBe(404);
  });
});

describe("POST /vehicles/:id/actions", () => {
  it("appends a new action and echoes the correlation id", async () => {
    const vin = vehicles[0].vin;
    const correlationId = "11111111-1111-1111-1111-111111111111";
    const res = await fetch(`http://localhost/vehicles/${vin}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Correlation-Id": correlationId },
      body: JSON.stringify({ action: "Price Reduction Planned" }),
    });
    expect(res.status).toBe(201);
    expect(res.headers.get("X-Correlation-Id")).toBe(correlationId);
    const record = (await res.json()) as AgingVehicleAction;
    expect(record.vehicleId).toBe(vin);
    expect(record.action).toBe("Price Reduction Planned");
  });

  it("does not overwrite a prior record for the same vehicle", async () => {
    const vin = vehicles[1].vin;
    const countBefore = actions.filter((a) => a.vehicleId === vin).length;

    await fetch(`http://localhost/vehicles/${vin}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "First action" }),
    });
    await fetch(`http://localhost/vehicles/${vin}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "Second action" }),
    });

    const forVehicle = actions.filter((a) => a.vehicleId === vin);
    expect(forVehicle).toHaveLength(countBefore + 2);
    expect(forVehicle.map((a) => a.action)).toEqual(
      expect.arrayContaining(["First action", "Second action"]),
    );
  });

  it("rejects an empty action with 400", async () => {
    const vin = vehicles[2].vin;
    const res = await fetch(`http://localhost/vehicles/${vin}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "" }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown vehicle", async () => {
    const res = await fetch("http://localhost/vehicles/UNKNOWN-VIN/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "Anything" }),
    });
    expect(res.status).toBe(404);
  });
});
