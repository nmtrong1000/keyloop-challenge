"use client";

import { AgingBadge, AgingCountBanner } from "@/modules/AgingStock";
import { InventoryView } from "@/modules/Inventory";
import { AgingVehicleExtras, LatestActionLog } from "@/modules/ActionLogging";

export function DashboardContent() {
  return (
    <>
      <h1 className="mt-1 font-headline text-headline-lg-mobile md:text-headline-lg">
        Intelligent Inventory Dashboard
      </h1>

      <div className="mt-6">
        <InventoryView
          renderAgingSummary={(agingCount) => <AgingCountBanner agingCount={agingCount} />}
          renderStatus={(vehicle) => <AgingBadge vehicle={vehicle} />}
          renderLog={(vehicle) => <LatestActionLog vehicle={vehicle} />}
          renderAction={(vehicle) => <AgingVehicleExtras vehicle={vehicle} />}
        />
      </div>
    </>
  );
}
