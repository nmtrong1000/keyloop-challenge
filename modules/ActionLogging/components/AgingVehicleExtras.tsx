"use client";

import { useState } from "react";
import type { Vehicle } from "@/shared/types/api";
import { isAgingVehicle } from "@/modules/AgingStock";
import { Modal } from "@/shared/components/blocks/Modal";
import { Button } from "@/shared/components/elements/Button";
import { ActionForm } from "./ActionForm";
import { ActionHistory } from "./ActionHistory";

export function AgingVehicleExtras({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = useState(false);
  if (!isAgingVehicle(vehicle.intakeDate)) return null;

  return (
    <>
      <Button className="w-fit" onClick={() => setOpen(true)}>
        Log action
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${vehicle.make} ${vehicle.model} — ${vehicle.vin}`}
      >
        <div className="flex flex-col gap-1">
          <h3 className="font-mono text-label-sm text-on-surface-variant mb-2">Log an action</h3>
          <ActionForm vehicleId={vehicle.vin} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-mono text-label-sm text-on-surface-variant mb-2">History</h3>
          <ActionHistory vehicleId={vehicle.vin} />
        </div>
      </Modal>
    </>
  );
}
