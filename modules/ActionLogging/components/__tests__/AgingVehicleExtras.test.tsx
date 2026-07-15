import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { getVehicleActions, postVehicleAction } from "@/modules/ActionLogging/dal";
import type { Vehicle } from "@/shared/types/api";
import { AgingVehicleExtras } from "../AgingVehicleExtras";

jest.mock("@/modules/ActionLogging/dal", () => ({
  getVehicleActions: jest.fn(),
  postVehicleAction: jest.fn(),
}));
const mockedGetVehicleActions = getVehicleActions as jest.Mock;
const mockedPostVehicleAction = postVehicleAction as jest.Mock;

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const agingVehicle: Vehicle = {
  vin: "VIN-AGING",
  make: "Honda",
  model: "Accord",
  intakeDate: "2025-01-01",
};

const freshVehicle: Vehicle = {
  vin: "VIN-FRESH",
  make: "Honda",
  model: "Accord",
  intakeDate: "2026-07-01",
};

beforeEach(() => {
  mockedGetVehicleActions.mockReset();
  mockedPostVehicleAction.mockReset();
  mockedGetVehicleActions.mockResolvedValue([]);
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe("AgingVehicleExtras", () => {
  it("renders nothing for a non-aging vehicle", () => {
    const { container } = renderWithClient(<AgingVehicleExtras vehicle={freshVehicle} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a trigger for an aging vehicle, hiding the form until opened", () => {
    renderWithClient(<AgingVehicleExtras vehicle={agingVehicle} />);
    expect(screen.getByRole("button", { name: "Log action" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Status or proposed action")).not.toBeInTheDocument();
  });

  it("submitting an action refreshes the history without a manual refresh", async () => {
    const user = userEvent.setup();
    mockedPostVehicleAction.mockResolvedValue({
      vehicleId: "VIN-AGING",
      action: "Price Reduction Planned",
      timestamp: new Date().toISOString(),
    });

    renderWithClient(<AgingVehicleExtras vehicle={agingVehicle} />);
    await user.click(screen.getByRole("button", { name: "Log action" }));
    expect(await screen.findByText("No actions logged yet.")).toBeInTheDocument();

    // After submission, a refetch of history should surface the new record.
    mockedGetVehicleActions.mockResolvedValue([
      { vehicleId: "VIN-AGING", action: "Price Reduction Planned", timestamp: new Date().toISOString() },
    ]);

    await user.type(
      screen.getByLabelText("Status or proposed action"),
      "Price Reduction Planned",
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(screen.getByRole("listitem")).toHaveTextContent("Price Reduction Planned"),
    );
    expect(screen.queryByText("No actions logged yet.")).not.toBeInTheDocument();
  });
});
