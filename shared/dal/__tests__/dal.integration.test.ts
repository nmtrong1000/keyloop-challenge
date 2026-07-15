/** Runs under the "node" Jest project — exercises the DAL against real MSW handlers, not a further-mocked DAL. */
import { server } from "@/shared/mocks/server";
import { vehicles } from "@/shared/mocks/fixtures";
import { DataAccessError, getVehicleActions, getVehicles, postVehicleAction } from "..";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getVehicles", () => {
  it("returns a typed paged result (success path)", async () => {
    const result = await getVehicles({ page: 1, pageSize: 5 });
    expect(result.items).toHaveLength(5);
    expect(typeof result.totalCount).toBe("number");
    expect(typeof result.agingCount).toBe("number");
  });

  it("passes filters through as query params", async () => {
    const result = await getVehicles({ filters: { make: "Honda" } });
    expect(result.items.every((v) => v.make === "Honda")).toBe(true);
  });

  it("throws a typed DataAccessError on a 400 (error path)", async () => {
    await expect(
      // @ts-expect-error — deliberately invalid to exercise the error path
      getVehicles({ filters: { ageRange: "not-a-range" } }),
    ).rejects.toBeInstanceOf(DataAccessError);
  });

  it("passes sortBy/sortDir through as query params", async () => {
    const result = await getVehicles({ pageSize: 500, sortBy: "make", sortDir: "desc" });
    const makes = result.items.map((v) => v.make);
    expect(makes).toEqual([...makes].sort().reverse());
  });
});

describe("getVehicleActions", () => {
  it("returns the vehicle's action history (success path)", async () => {
    const vin = vehicles[0].vin;
    const history = await getVehicleActions(vin);
    expect(Array.isArray(history)).toBe(true);
  });

  it("throws a typed DataAccessError on a 404 (error path)", async () => {
    await expect(getVehicleActions("UNKNOWN-VIN")).rejects.toBeInstanceOf(DataAccessError);
  });
});

describe("postVehicleAction", () => {
  it("returns the created AgingVehicleAction (success path)", async () => {
    const vin = vehicles[10].vin;
    const record = await postVehicleAction(vin, "Price Reduction Planned");
    expect(record.vehicleId).toBe(vin);
    expect(record.action).toBe("Price Reduction Planned");
  });

  it("forwards correlationId as the X-Correlation-Id header", async () => {
    const vin = vehicles[11].vin;
    const correlationId = "22222222-2222-2222-2222-222222222222";

    let capturedHeader: string | null = null;
    const { http, HttpResponse } = await import("msw");
    server.use(
      http.post("*/vehicles/:id/actions", async ({ request }) => {
        capturedHeader = request.headers.get("X-Correlation-Id");
        return HttpResponse.json(
          { vehicleId: vin, action: "x", timestamp: new Date().toISOString() },
          { status: 201 },
        );
      }),
    );

    await postVehicleAction(vin, "x", { correlationId });
    expect(capturedHeader).toBe(correlationId);
  });

  it("throws a typed DataAccessError on a 404 (error path)", async () => {
    await expect(
      postVehicleAction("UNKNOWN-VIN", "Anything"),
    ).rejects.toBeInstanceOf(DataAccessError);
  });
});
