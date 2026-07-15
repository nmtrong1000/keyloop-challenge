import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  tone?: "amber" | "neutral";
}

const TONE_CLASSES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  // No design-system "warning" token exists yet (STORY_11) — amber stays a raw Tailwind color, not a token.
  amber: "bg-amber-100 text-amber-900",
  neutral: "bg-surface-container text-on-surface-variant",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded px-2 py-0.5 font-mono text-label-sm ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
