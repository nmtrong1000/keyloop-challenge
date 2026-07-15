import { render, screen } from "@testing-library/react";
import { AgingCountBanner } from "../AgingCountBanner";

describe("AgingCountBanner", () => {
  it("uses singular phrasing for a count of 1", () => {
    render(<AgingCountBanner agingCount={1} />);
    expect(screen.getByRole("status").textContent).toMatch(/1 vehicle\b/);
  });

  it("uses plural phrasing for counts other than 1", () => {
    const { rerender } = render(<AgingCountBanner agingCount={42} />);
    expect(screen.getByRole("status").textContent).toMatch(/42 vehicles\b/);

    rerender(<AgingCountBanner agingCount={0} />);
    expect(screen.getByRole("status").textContent).toMatch(/0 vehicles\b/);
  });
});
