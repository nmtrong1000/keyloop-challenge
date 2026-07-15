import { MetricCard } from "@/shared/components/MetricCard";

export function AgingCountBanner({ agingCount }: { agingCount: number }) {
  return (
    <MetricCard
      label="Aging Stock (>90 days)"
      value={`${agingCount} ${agingCount === 1 ? "vehicle" : "vehicles"}`}
      tone="amber"
      live
    />
  );
}
