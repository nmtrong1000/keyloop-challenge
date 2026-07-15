import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { postVehicleAction } from "@/modules/ActionLogging/dal";
import { ActionForm } from "../ActionForm";

jest.mock("@/modules/ActionLogging/dal", () => ({
  postVehicleAction: jest.fn(),
}));
const mockedPostVehicleAction = postVehicleAction as jest.Mock;

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  mockedPostVehicleAction.mockReset();
  mockedPostVehicleAction.mockResolvedValue({
    vehicleId: "VIN1",
    action: "Price Reduction Planned",
    timestamp: new Date().toISOString(),
  });
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe("ActionForm", () => {
  it("blocks submission and shows an error for an empty action", async () => {
    const user = userEvent.setup();
    renderWithClient(<ActionForm vehicleId="VIN1" />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Enter a status or proposed action.",
    );
    expect(mockedPostVehicleAction).not.toHaveBeenCalled();
  });

  it("submits with a generated correlation ID and clears the field on success", async () => {
    const user = userEvent.setup();
    renderWithClient(<ActionForm vehicleId="VIN1" />);

    const input = screen.getByLabelText("Status or proposed action");
    await user.type(input, "Price Reduction Planned");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(mockedPostVehicleAction).toHaveBeenCalledTimes(1));
    const [vehicleId, action, options] = mockedPostVehicleAction.mock.calls[0];
    expect(vehicleId).toBe("VIN1");
    expect(action).toBe("Price Reduction Planned");
    expect(options.correlationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );

    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("logs aging_vehicle.action_logged with the correlation ID on success", async () => {
    const user = userEvent.setup();
    renderWithClient(<ActionForm vehicleId="VIN1" />);
    await user.type(screen.getByLabelText("Status or proposed action"), "Test action");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      const logged = (console.log as jest.Mock).mock.calls
        .map(([msg]) => JSON.parse(msg as string))
        .find((entry) => entry.event === "aging_vehicle.action_logged");
      expect(logged).toBeDefined();
      expect(logged.vehicleId).toBe("VIN1");
      expect(logged.correlationId).toBeDefined();
    });
  });

  it("shows an error message if the submission fails", async () => {
    mockedPostVehicleAction.mockRejectedValueOnce(new Error("boom"));
    const user = userEvent.setup();
    renderWithClient(<ActionForm vehicleId="VIN1" />);
    await user.type(screen.getByLabelText("Status or proposed action"), "Test action");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Failed to log action. Try again.")).toBeInTheDocument();
  });
});
