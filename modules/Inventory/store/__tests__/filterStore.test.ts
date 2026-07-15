import { act, renderHook } from "@testing-library/react";
import { useFilterStore } from "../filterStore";
import { PAGE_SIZE } from "@/shared/constants";

// Zustand store instance is module-level (shared across tests) — reset it.
function resetStore() {
  useFilterStore.setState({
    page: 1,
    pageSize: PAGE_SIZE,
    filters: {},
    sortBy: undefined,
    sortDir: "asc",
  });
}

describe("useFilterStore", () => {
  beforeEach(resetStore);

  it("starts on page 1 with no filters, the default page size, and no sort", () => {
    const { result } = renderHook(() => useFilterStore());
    expect(result.current.page).toBe(1);
    expect(result.current.filters).toEqual({});
    expect(result.current.pageSize).toBe(PAGE_SIZE);
    expect(result.current.sortBy).toBeUndefined();
    expect(result.current.sortDir).toBe("asc");
  });

  it("setPage updates the page without touching filters", () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setMake("Honda"));
    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);
    expect(result.current.filters).toEqual({ make: "Honda" });
  });

  it("changing a filter resets the page back to 1", () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setPage(5));
    act(() => result.current.setMake("Toyota"));
    expect(result.current.page).toBe(1);
    expect(result.current.filters.make).toBe("Toyota");
  });

  it("setModel and setAgeRange also update filters and reset page", () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setPage(2));
    act(() => result.current.setModel("Civic"));
    expect(result.current.page).toBe(1);
    act(() => result.current.setPage(4));
    act(() => result.current.setAgeRange("90-plus"));
    expect(result.current.page).toBe(1);
    expect(result.current.filters).toEqual({ model: "Civic", ageRange: "90-plus" });
  });

  it("setPageSize updates the page size and resets the page back to 1", () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setPage(5));
    act(() => result.current.setPageSize(100));
    expect(result.current.pageSize).toBe(100);
    expect(result.current.page).toBe(1);
  });

  it("setSort on a new column sorts ascending and resets the page", () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setPage(3));
    act(() => result.current.setSort("make"));
    expect(result.current.sortBy).toBe("make");
    expect(result.current.sortDir).toBe("asc");
    expect(result.current.page).toBe(1);
  });

  it("setSort on the active ascending column toggles to descending", () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setSort("model"));
    act(() => result.current.setSort("model"));
    expect(result.current.sortBy).toBe("model");
    expect(result.current.sortDir).toBe("desc");
  });

  it("setSort on a different column restarts at ascending", () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setSort("make"));
    act(() => result.current.setSort("make")); // now desc
    act(() => result.current.setSort("intakeDate"));
    expect(result.current.sortBy).toBe("intakeDate");
    expect(result.current.sortDir).toBe("asc");
  });
});
