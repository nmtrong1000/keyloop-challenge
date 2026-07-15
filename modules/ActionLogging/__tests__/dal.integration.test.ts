/** Runs under the "node" Jest project — exercises the DAL against real MSW handlers, not a further-mocked DAL. */
import { server } from "@/shared/mocks/server";
import { vehicles } from "@/shared/mocks/fixtures";
import { DataAccessError } from "@/shared/http";
import { getVehicleActions, postVehicleAction } from "../dal";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
