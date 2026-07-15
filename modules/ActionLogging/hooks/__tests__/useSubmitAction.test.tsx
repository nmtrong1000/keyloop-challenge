import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { getVehicles } from "@/modules/Inventory/dal";
import { useFilterStore } from "@/modules/Inventory/store/filterStore";
import { useVehiclesQuery } from "@/modules/Inventory/hooks/useVehiclesQuery";
import { postVehicleAction } from "../../dal";
import { useSubmitAction } from "../useSubmitAction";

jest.mock("@/modules/Inventory/dal", () => ({
  getVehicles: jest.fn(),
}));
jest.mock("../../dal", () => ({
  postVehicleAction: jest.fn(),
}));

const mockedGetVehicles = getVehicles as jest.Mock;
const mockedPostVehicleAction = postVehicleAction as jest.Mock;

let client: QueryClient;
function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  mockedGetVehicles.mockReset();
  mockedPostVehicleAction.mockReset();
  mockedGetVehicles.mockResolvedValue({ items: [], totalCount: 0, agingCount: 0 });
  mockedPostVehicleAction.mockResolvedValue({
    vehicleId: "VIN1",
    action: "Price Reduction Planned",
    timestamp: new Date().toISOString(),
  });
  useFilterStore.setState({ page: 1, filters: {} });
});

function useCombined() {
  return { query: useVehiclesQuery(), mutation: useSubmitAction() };
}

describe("useSubmitAction", () => {
  it("invalidates the vehicles query on a successful submission (mutate-then-invalidate)", async () => {
    const { result } = renderHook(() => useCombined(), { wrapper });
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));

    const callsBeforeSubmit = mockedGetVehicles.mock.calls.length;

    result.current.mutation.mutate({ vehicleId: "VIN1", action: "Price Reduction Planned" });

    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));
    await waitFor(() =>
      expect(mockedGetVehicles.mock.calls.length).toBeGreaterThan(callsBeforeSubmit),
    );
  });

  it("does not invalidate on a failed submission", async () => {
    mockedPostVehicleAction.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useCombined(), { wrapper });
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));

    const callsBeforeSubmit = mockedGetVehicles.mock.calls.length;
    result.current.mutation.mutate({ vehicleId: "VIN1", action: "x" });

    await waitFor(() => expect(result.current.mutation.isError).toBe(true));
    expect(mockedGetVehicles.mock.calls.length).toBe(callsBeforeSubmit);
  });
});
