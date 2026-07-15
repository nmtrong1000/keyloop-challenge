import { render, screen } from "@testing-library/react";
import type { Vehicle } from "@/shared/types/api";
import { AgingBadge } from "../AgingBadge";

const TODAY = new Date("2026-07-15");

function daysAgo(days: number): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

describe("AgingBadge", () => {
  it("renders nothing for a vehicle 90 days old or fewer", () => {
    const vehicle: Vehicle = { vin: "V1", make: "Honda", model: "Accord", intakeDate: daysAgo(90) };
    const { container } = render(<AgingBadge vehicle={vehicle} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the Aging Stock badge for a vehicle over 90 days old", () => {
    const vehicle: Vehicle = { vin: "V1", make: "Honda", model: "Accord", intakeDate: daysAgo(91) };
    render(<AgingBadge vehicle={vehicle} />);
    expect(screen.getByText("Aging Stock")).toBeInTheDocument();
  });
});
