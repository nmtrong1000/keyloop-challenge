import type { AgingVehicleAction } from "@/shared/types/api";
import { actionsForVehicle, mostRecentAction } from "../currentStatus";

const actions: AgingVehicleAction[] = [
  { vehicleId: "VIN1", action: "First", timestamp: "2026-01-01T00:00:00.000Z" },
  { vehicleId: "VIN1", action: "Second (latest)", timestamp: "2026-03-01T00:00:00.000Z" },
  { vehicleId: "VIN1", action: "Middle", timestamp: "2026-02-01T00:00:00.000Z" },
  { vehicleId: "VIN2", action: "Other vehicle", timestamp: "2026-06-01T00:00:00.000Z" },
];

describe("mostRecentAction", () => {
  it("returns the action with the latest timestamp, not array order", () => {
    expect(mostRecentAction("VIN1", actions)?.action).toBe("Second (latest)");
  });

  it("only considers actions for the given vehicle", () => {
    expect(mostRecentAction("VIN2", actions)?.action).toBe("Other vehicle");
  });

  it("returns undefined when the vehicle has no logged actions", () => {
    expect(mostRecentAction("VIN-NONE", actions)).toBeUndefined();
  });
});

describe("actionsForVehicle", () => {
  it("returns all of a vehicle's actions, most recent first", () => {
    expect(actionsForVehicle("VIN1", actions).map((a) => a.action)).toEqual([
      "Second (latest)",
      "Middle",
      "First",
    ]);
  });

  it("returns an empty array when the vehicle has no logged actions", () => {
    expect(actionsForVehicle("VIN-NONE", actions)).toEqual([]);
  });
});
