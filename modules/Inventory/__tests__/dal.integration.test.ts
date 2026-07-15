/** Runs under the "node" Jest project — exercises the DAL against real MSW handlers, not a further-mocked DAL. */
import { server } from "@/shared/mocks/server";
import { DataAccessError } from "@/shared/http";
import { getVehicles } from "../dal";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getVehicles", () => {
  it("returns a typed paged result (success path)", async () => {
    const result = await getVehicles({ page: 1, pageSize: 5 });
    expect(result.items).toHaveLength(5);
    expect(typeof result.totalCount).toBe("number");
    expect(typeof result.agingCount).toBe("number");
  });

  it("passes filters through as query params", async () => {
    const result = await getVehicles({ filters: { make: "Honda" } });
    expect(result.items.every((v) => v.make === "Honda")).toBe(true);
  });

  it("throws a typed DataAccessError on a 400 (error path)", async () => {
    await expect(
      // @ts-expect-error — deliberately invalid to exercise the error path
      getVehicles({ filters: { ageRange: "not-a-range" } }),
    ).rejects.toBeInstanceOf(DataAccessError);
  });

  it("passes sortBy/sortDir through as query params", async () => {
    const result = await getVehicles({ pageSize: 500, sortBy: "make", sortDir: "desc" });
    const makes = result.items.map((v) => v.make);
    expect(makes).toEqual([...makes].sort().reverse());
  });
});
