import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getVehicles } from "@/modules/Inventory/dal";
import { vehiclesQueryKey } from "@/modules/Inventory/hooks/queryKeys";
import { PAGE_SIZE } from "@/shared/constants";
import { getQueryClient } from "@/shared/providers/queryClient";
import { DashboardContent } from "./dashboard-content";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: vehiclesQueryKey(1, PAGE_SIZE, {}, undefined, "asc"),
    queryFn: () => getVehicles({ page: 1, pageSize: PAGE_SIZE }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardContent />
    </HydrationBoundary>
  );
}
