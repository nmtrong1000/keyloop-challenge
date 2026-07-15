import type { Vehicle } from "@/shared/types/api";
import { sortVehicles } from "../sorting";

const vehicles: Vehicle[] = [
  { vin: "V3", make: "Toyota", model: "Camry", intakeDate: "2026-03-01" },
  { vin: "V1", make: "Honda", model: "Accord", intakeDate: "2026-05-01" },
  { vin: "V2", make: "Ford", model: "Escape", intakeDate: "2026-01-01" },
];

describe("sortVehicles", () => {
  it("returns the vehicles unchanged (same order) when sortBy is omitted", () => {
    expect(sortVehicles(vehicles)).toEqual(vehicles);
  });

  it("sorts by make ascending by default", () => {
    const result = sortVehicles(vehicles, "make");
    expect(result.map((v) => v.make)).toEqual(["Ford", "Honda", "Toyota"]);
  });

  it("sorts by make descending", () => {
    const result = sortVehicles(vehicles, "make", "desc");
    expect(result.map((v) => v.make)).toEqual(["Toyota", "Honda", "Ford"]);
  });

  it("sorts by model", () => {
    const result = sortVehicles(vehicles, "model");
    expect(result.map((v) => v.model)).toEqual(["Accord", "Camry", "Escape"]);
  });

  it("sorts by intakeDate", () => {
    const result = sortVehicles(vehicles, "intakeDate");
    expect(result.map((v) => v.intakeDate)).toEqual(["2026-01-01", "2026-03-01", "2026-05-01"]);
  });

  it("does not mutate the input array", () => {
    const original = [...vehicles];
    sortVehicles(vehicles, "make");
    expect(vehicles).toEqual(original);
  });
});
