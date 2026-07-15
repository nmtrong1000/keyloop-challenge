import type { ReactNode } from "react";

export interface MetricCardProps {
  label: string;
  value: ReactNode;
  tone?: "amber" | "neutral";
  /** Sets role="status" for polling-driven cards whose value updates without user action. Opt-in, not every metric card needs it. */
  live?: boolean;
}

const TONE_CLASSES: Record<NonNullable<MetricCardProps["tone"]>, { border: string; bg: string; text: string }> = {
  amber: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-900" },
  neutral: { border: "border-outline-variant", bg: "bg-surface-container-lowest", text: "text-on-surface" },
};

export function MetricCard({ label, value, tone = "neutral", live }: MetricCardProps) {
  const { border, bg, text } = TONE_CLASSES[tone];
  return (
    <div
      role={live ? "status" : undefined}
      className={`flex w-fit min-w-[220px] flex-col gap-1 rounded border ${border} ${bg} px-6 py-4`}
    >
      <span className={`font-mono text-label-sm ${text}`}>{label}</span>
      <span className={`font-headline text-headline-lg ${text}`}>{value}</span>
    </div>
  );
}
