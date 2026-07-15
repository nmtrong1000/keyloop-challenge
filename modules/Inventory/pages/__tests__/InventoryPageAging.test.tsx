import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { getVehicles } from "@/shared/dal";
import { useFilterStore } from "@/shared/store/filterStore";
import { POLL_INTERVAL_MS } from "@/shared/store/useVehiclesQuery";
import { AgingBadge, AgingCountBanner } from "@/modules/AgingStock";
import { LatestActionLog } from "@/modules/ActionLogging";
import { InventoryPage } from "../InventoryPage";

jest.mock("@/shared/dal", () => ({ getVehicles: jest.fn() }));
const mockedGetVehicles = getVehicles as jest.Mock;

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const agingVehicle = {
  vin: "VIN-AGING",
  make: "Honda",
  model: "Accord",
  intakeDate: "2025-01-01", // well over 90 days before any plausible "today"
};

beforeEach(() => {
  mockedGetVehicles.mockReset();
  useFilterStore.setState({ page: 1, filters: {} });
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe("InventoryPage composed with the aging slots (mirrors app/page.tsx)", () => {
  it("shows the aging badge, no status, and the global count on first load", async () => {
    mockedGetVehicles.mockResolvedValue({
      items: [agingVehicle],
      totalCount: 1,
      agingCount: 7,
    });

    renderWithClient(
      <InventoryPage
        renderAgingSummary={(count) => <AgingCountBanner agingCount={count} />}
        renderStatus={(v) => <AgingBadge vehicle={v} />}
        renderLog={(v) => <LatestActionLog vehicle={v} />}
      />,
    );

    expect(await screen.findByText("Aging Stock")).toBeInTheDocument();
    expect(screen.getByRole("status").textContent).toMatch(/7 vehicles\b/);
    expect(screen.queryByText("Price Reduction Planned")).not.toBeInTheDocument();
  });

  it("updates the badge's status and the global count after a simulated background poll", async () => {
    jest.useFakeTimers({ advanceTimers: true });
    mockedGetVehicles.mockResolvedValue({
      items: [agingVehicle],
      totalCount: 1,
      agingCount: 7,
    });

    renderWithClient(
      <InventoryPage
        renderAgingSummary={(count) => <AgingCountBanner agingCount={count} />}
        renderStatus={(v) => <AgingBadge vehicle={v} />}
        renderLog={(v) => <LatestActionLog vehicle={v} />}
      />,
    );
    await screen.findByText("Aging Stock");
    expect(screen.queryByText("Price Reduction Planned")).not.toBeInTheDocument();

    // Simulate what a real poll would fetch after a manager logs an action
    // elsewhere: the mock's currentStatus/agingCount are recomputed server-side.
    mockedGetVehicles.mockResolvedValue({
      items: [{ ...agingVehicle, currentStatus: "Price Reduction Planned" }],
      totalCount: 1,
      agingCount: 8,
    });

    jest.advanceTimersByTime(POLL_INTERVAL_MS + 1000);

    await waitFor(() =>
      expect(screen.getByText("Price Reduction Planned")).toBeInTheDocument(),
    );
    expect(screen.getByRole("status").textContent).toMatch(/8 vehicles\b/);
    jest.useRealTimers();
  });
});
