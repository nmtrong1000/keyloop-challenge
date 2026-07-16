import { render, screen } from "@testing-library/react";
import type { Vehicle } from "@/shared/types/api";
import { LatestActionLog } from "../LatestActionLog";

const TODAY = new Date("2026-07-15");

function daysAgo(days: number): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("LatestActionLog", () => {
  it("shows a placeholder for a vehicle 90 days old or fewer (not aging, never logged)", () => {
    const vehicle: Vehicle = { vin: "V1", make: "Honda", model: "Accord", intakeDate: daysAgo(90) };
    render(<LatestActionLog vehicle={vehicle} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows a placeholder when no action has been logged yet", () => {
    const vehicle: Vehicle = { vin: "V1", make: "Honda", model: "Accord", intakeDate: daysAgo(91) };
    render(<LatestActionLog vehicle={vehicle} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows currentStatus when present", () => {
    const vehicle: Vehicle = {
      vin: "V1",
      make: "Honda",
      model: "Accord",
      intakeDate: daysAgo(91),
      currentStatus: "Price Reduction Planned",
    };
    render(<LatestActionLog vehicle={vehicle} />);
    expect(screen.getByText("Price Reduction Planned")).toBeInTheDocument();
  });
});
