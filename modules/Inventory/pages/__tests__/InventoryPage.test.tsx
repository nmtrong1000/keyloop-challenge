import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { getVehicles } from "@/shared/dal";
import { PAGE_SIZE } from "@/shared/constants";
import { useFilterStore } from "@/shared/store/filterStore";
import { InventoryPage } from "../InventoryPage";

jest.mock("@/shared/dal", () => ({
  getVehicles: jest.fn(),
}));

const mockedGetVehicles = getVehicles as jest.Mock;

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const vehicle = {
  vin: "VIN00000001",
  make: "Honda",
  model: "Accord",
  intakeDate: "2026-01-01",
};

beforeEach(() => {
  mockedGetVehicles.mockReset();
  mockedGetVehicles.mockResolvedValue({ items: [vehicle], totalCount: 1, agingCount: 1 });
  useFilterStore.setState({ page: 1, filters: {} });
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("InventoryPage", () => {
  it("renders the fetched vehicles", async () => {
    renderWithClient(<InventoryPage />);
    expect(await screen.findByText("VIN00000001")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getByText("Honda")).toBeInTheDocument();
  });

  it("logs inventory.viewed once after data loads, with page and pageSize", async () => {
    renderWithClient(<InventoryPage />);
    await screen.findByText("VIN00000001");

    const viewedCalls = (console.log as jest.Mock).mock.calls
      .map(([msg]) => JSON.parse(msg as string))
      .filter((entry) => entry.event === "inventory.viewed");
    expect(viewedCalls).toHaveLength(1);
    expect(viewedCalls[0]).toMatchObject({ page: 1, pageSize: PAGE_SIZE, count: 1 });
  });

  it("logs inventory.filtered when a filter is applied, not inventory.viewed again", async () => {
    const user = userEvent.setup();
    renderWithClient(<InventoryPage />);
    await screen.findByText("VIN00000001");
    (console.log as jest.Mock).mockClear();

    await user.selectOptions(screen.getByLabelText("Filter by make"), "Honda");

    await waitFor(() => {
      const filteredCalls = (console.log as jest.Mock).mock.calls.filter(([msg]) =>
        String(msg).includes("inventory.filtered"),
      );
      expect(filteredCalls.length).toBeGreaterThanOrEqual(1);
    });
    const viewedCallsAfter = (console.log as jest.Mock).mock.calls.filter(([msg]) =>
      String(msg).includes("inventory.viewed"),
    );
    expect(viewedCallsAfter).toHaveLength(0);
  });

  it("records a performance.measure named inventory-render", async () => {
    const measureSpy = jest.spyOn(performance, "measure");
    renderWithClient(<InventoryPage />);
    await screen.findByText("VIN00000001");

    await waitFor(() => {
      expect(measureSpy).toHaveBeenCalledWith(
        "inventory-render",
        "inventory-render-start",
        "inventory-render-end",
      );
    });
  });

  it("disables Previous on page 1 and paginates via Next", async () => {
    const totalCount = PAGE_SIZE * 2;
    mockedGetVehicles.mockResolvedValue({ items: [vehicle], totalCount, agingCount: 5 });
    const user = userEvent.setup();
    renderWithClient(<InventoryPage />);
    await screen.findByText("VIN00000001");

    expect(screen.getByText("Previous")).toBeDisabled();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    await user.click(screen.getByText("Next"));
    await waitFor(() => expect(useFilterStore.getState().page).toBe(2));
  });
});
