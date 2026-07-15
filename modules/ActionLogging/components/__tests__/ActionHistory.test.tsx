import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { getVehicleActions } from "@/shared/dal";
import { ActionHistory } from "../ActionHistory";

jest.mock("@/shared/dal", () => ({
  getVehicleActions: jest.fn(),
}));
const mockedGetVehicleActions = getVehicleActions as jest.Mock;

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("ActionHistory", () => {
  it("shows a message when no actions have been logged", async () => {
    mockedGetVehicleActions.mockResolvedValue([]);
    renderWithClient(<ActionHistory vehicleId="VIN1" />);
    expect(await screen.findByText("No actions logged yet.")).toBeInTheDocument();
  });

  it("lists all actions, most recent first (as returned by the DAL)", async () => {
    mockedGetVehicleActions.mockResolvedValue([
      { vehicleId: "VIN1", action: "Second", timestamp: "2026-02-01T00:00:00.000Z" },
      { vehicleId: "VIN1", action: "First", timestamp: "2026-01-01T00:00:00.000Z" },
    ]);
    renderWithClient(<ActionHistory vehicleId="VIN1" />);

    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Second");
    expect(items[1]).toHaveTextContent("First");
  });

  it("shows an error message if fetching history fails", async () => {
    mockedGetVehicleActions.mockRejectedValue(new Error("boom"));
    renderWithClient(<ActionHistory vehicleId="VIN1" />);
    expect(await screen.findByText("Failed to load history.")).toBeInTheDocument();
  });

  it("toggles an entry's clamp via its Show more/Show less button", async () => {
    const user = userEvent.setup();
    mockedGetVehicleActions.mockResolvedValue([
      { vehicleId: "VIN1", action: "Some action", timestamp: "2026-02-01T00:00:00.000Z" },
    ]);
    renderWithClient(<ActionHistory vehicleId="VIN1" />);

    const toggle = await screen.findByRole("button", { name: "Show more" });
    await user.click(toggle);
    expect(await screen.findByRole("button", { name: "Show less" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show less" }));
    expect(await screen.findByRole("button", { name: "Show more" })).toBeInTheDocument();
  });
});
