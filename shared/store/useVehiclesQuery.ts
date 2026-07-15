import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getVehicles } from "@/shared/dal";
import { useFilterStore } from "./filterStore";
import { vehiclesQueryKey } from "./queryKeys";

/** SDD §4.1: poll every 30-60s (using 45s, the midpoint) so the list stays fresh without a manual refresh. */
export const POLL_INTERVAL_MS = 45_000;

/** Query is keyed by page + pageSize + filters + sort — changing any triggers a new server-side query automatically. */
export function useVehiclesQuery() {
  const page = useFilterStore((s) => s.page);
  const pageSize = useFilterStore((s) => s.pageSize);
  const filters = useFilterStore((s) => s.filters);
  const sortBy = useFilterStore((s) => s.sortBy);
  const sortDir = useFilterStore((s) => s.sortDir);

  return useQuery({
    queryKey: vehiclesQueryKey(page, pageSize, filters, sortBy, sortDir),
    queryFn: () => getVehicles({ page, pageSize, filters, sortBy, sortDir }),
    refetchInterval: POLL_INTERVAL_MS,
    placeholderData: keepPreviousData,
  });
}
