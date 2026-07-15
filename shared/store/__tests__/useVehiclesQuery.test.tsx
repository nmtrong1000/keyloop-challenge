import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { getVehicles } from "@/shared/dal";
import { useFilterStore } from "../filterStore";
import { POLL_INTERVAL_MS, useVehiclesQuery } from "../useVehiclesQuery";

jest.mock("@/shared/dal", () => ({
  getVehicles: jest.fn(),
}));

const mockedGetVehicles = getVehicles as jest.Mock;

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  mockedGetVehicles.mockReset();
  mockedGetVehicles.mockResolvedValue({ items: [], totalCount: 0, agingCount: 0 });
  useFilterStore.setState({ page: 1, pageSize: 20, filters: {}, sortBy: undefined, sortDir: "asc" });
});

describe("useVehiclesQuery", () => {
  it("fetches page 1 with no filters on first render", async () => {
    const { result } = renderHook(() => useVehiclesQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGetVehicles).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      filters: {},
      sortBy: undefined,
      sortDir: "asc",
    });
  });

  it("refetches automatically when the page changes", async () => {
    const { result } = renderHook(() => useVehiclesQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    useFilterStore.getState().setPage(2);

    await waitFor(() =>
      expect(mockedGetVehicles).toHaveBeenLastCalledWith({
        page: 2,
        pageSize: 20,
        filters: {},
        sortBy: undefined,
        sortDir: "asc",
      }),
    );
  });

  it("refetches automatically when a filter changes", async () => {
    const { result } = renderHook(() => useVehiclesQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    useFilterStore.getState().setMake("Honda");

    await waitFor(() =>
      expect(mockedGetVehicles).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 20,
        filters: { make: "Honda" },
        sortBy: undefined,
        sortDir: "asc",
      }),
    );
  });

  it("refetches automatically when the page size changes, resetting to page 1", async () => {
    const { result } = renderHook(() => useVehiclesQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    useFilterStore.getState().setPage(3);
    useFilterStore.getState().setPageSize(50);

    await waitFor(() =>
      expect(mockedGetVehicles).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 50,
        filters: {},
        sortBy: undefined,
        sortDir: "asc",
      }),
    );
  });

  it("refetches automatically when the sort changes", async () => {
    const { result } = renderHook(() => useVehiclesQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    useFilterStore.getState().setSort("make");

    await waitFor(() =>
      expect(mockedGetVehicles).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 20,
        filters: {},
        sortBy: "make",
        sortDir: "asc",
      }),
    );
  });

  it("polls at POLL_INTERVAL_MS", async () => {
    jest.useFakeTimers({ advanceTimers: true });
    const { result } = renderHook(() => useVehiclesQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const callsBefore = mockedGetVehicles.mock.calls.length;
    jest.advanceTimersByTime(POLL_INTERVAL_MS + 1000);
    await waitFor(() =>
      expect(mockedGetVehicles.mock.calls.length).toBeGreaterThan(callsBefore),
    );
    jest.useRealTimers();
  });
});
