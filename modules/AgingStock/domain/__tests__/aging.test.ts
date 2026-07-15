import { AGING_THRESHOLD_DAYS, daysInInventory, isAgingVehicle } from "../aging";

const TODAY = new Date("2026-07-15T00:00:00.000Z");

describe("aging calculation (SRS: >90 days = aging stock)", () => {
  it("computes daysInInventory from intakeDate", () => {
    expect(daysInInventory("2026-07-01", TODAY)).toBe(14);
  });

  it("is NOT aging at exactly the 90-day boundary", () => {
    const intake = new Date(TODAY);
    intake.setUTCDate(intake.getUTCDate() - AGING_THRESHOLD_DAYS);
    expect(isAgingVehicle(intake.toISOString(), TODAY)).toBe(false);
  });

  it("IS aging at 91 days", () => {
    const intake = new Date(TODAY);
    intake.setUTCDate(intake.getUTCDate() - (AGING_THRESHOLD_DAYS + 1));
    expect(isAgingVehicle(intake.toISOString(), TODAY)).toBe(true);
  });

  it("is not aging for a recently intaken vehicle", () => {
    expect(isAgingVehicle("2026-07-10", TODAY)).toBe(false);
  });
});
