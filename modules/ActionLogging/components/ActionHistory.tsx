"use client";

import { useState } from "react";
import { useVehicleActionsQuery } from "../hooks/useVehicleActionsQuery";
import { Button } from "@/shared/components/Button";

export function ActionHistory({ vehicleId }: { vehicleId: string }) {
  const { data, isLoading, isError } = useVehicleActionsQuery(vehicleId, true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  if (isLoading) {
    return (
      <p className="py-8 text-center text-body-md text-on-surface-variant">Loading history…</p>
    );
  }
  if (isError) {
    return <p className="py-8 text-center text-body-md text-error">Failed to load history.</p>;
  }
  if (!data || data.length === 0) {
    return (
      <p className="py-8 text-center text-body-md text-on-surface-variant">
        No actions logged yet.
      </p>
    );
  }

  return (
    <ul className="flex max-h-64 flex-col divide-y divide-outline-variant overflow-y-auto rounded border border-outline-variant">
      {data.map((record, i) => {
        // Records are append-only (no id) — timestamp + index is stable within one fetch.
        const isExpanded = expanded.has(i);
        return (
          <li key={`${record.timestamp}-${i}`} className="flex flex-col gap-0.5 px-4 py-2">
            <span
              className={`min-w-0 break-words text-body-sm text-on-surface ${isExpanded ? "" : "line-clamp-2"}`}
            >
              {record.action}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-label-sm text-on-surface-variant">
                {new Date(record.timestamp).toLocaleString()}
              </span>
              <Button variant="link" onClick={() => toggle(i)}>
                {isExpanded ? "Show less" : "Show more"}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
