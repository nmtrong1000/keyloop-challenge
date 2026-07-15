import type { Vehicle } from "@/shared/types/api";
import { matchesFilters } from "../filters";

const TODAY = new Date("2026-07-15T00:00:00.000Z");

const vehicle: Vehicle = {
  vin: "1HGCM82633A004352",
  make: "Honda",
  model: "Accord",
  intakeDate: "2026-04-01", // 105 days before TODAY -> aging (90-plus)
};

describe("matchesFilters", () => {
  it("matches on make", () => {
    expect(matchesFilters(vehicle, { make: "Honda" }, TODAY)).toBe(true);
    expect(matchesFilters(vehicle, { make: "Toyota" }, TODAY)).toBe(false);
  });

  it("matches on model", () => {
    expect(matchesFilters(vehicle, { model: "Accord" }, TODAY)).toBe(true);
    expect(matchesFilters(vehicle, { model: "Civic" }, TODAY)).toBe(false);
  });

  it("matches on ageRange", () => {
    expect(matchesFilters(vehicle, { ageRange: "90-plus" }, TODAY)).toBe(true);
    expect(matchesFilters(vehicle, { ageRange: "0-30" }, TODAY)).toBe(false);
  });

  it("combines multiple filters (AND, not OR)", () => {
    expect(
      matchesFilters(vehicle, { make: "Honda", ageRange: "0-30" }, TODAY),
    ).toBe(false);
    expect(
      matchesFilters(vehicle, { make: "Honda", ageRange: "90-plus" }, TODAY),
    ).toBe(true);
  });

  it("matches everything when no filters are active", () => {
    expect(matchesFilters(vehicle, {}, TODAY)).toBe(true);
  });
});
