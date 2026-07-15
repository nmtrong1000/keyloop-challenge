import type { AgingVehicleAction, PagedVehicles, Vehicle } from "../api";

describe("generated API types match SDD §3 domain model", () => {
  it("Vehicle has vin, make, model, intakeDate", () => {
    const vehicle: Vehicle = {
      vin: "1HGCM82633A004352",
      make: "Honda",
      model: "Accord",
      intakeDate: "2026-01-01",
    };
    expect(Object.keys(vehicle).sort()).toEqual(
      ["intakeDate", "make", "model", "vin"].sort(),
    );
  });

  it("AgingVehicleAction has vehicleId, action, timestamp", () => {
    const action: AgingVehicleAction = {
      vehicleId: "1HGCM82633A004352",
      action: "Price Reduction Planned",
      timestamp: "2026-01-01T00:00:00.000Z",
    };
    expect(Object.keys(action).sort()).toEqual(
      ["action", "timestamp", "vehicleId"].sort(),
    );
  });

  it("PagedVehicles wraps items with totalCount and agingCount", () => {
    const paged: PagedVehicles = { items: [], totalCount: 0, agingCount: 0 };
    expect(Object.keys(paged).sort()).toEqual(
      ["agingCount", "items", "totalCount"].sort(),
    );
  });
});
