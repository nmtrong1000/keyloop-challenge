import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "cursor-pointer rounded bg-secondary px-4 py-2 text-body-sm text-on-secondary enabled:hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40",
  secondary:
    "cursor-pointer rounded border border-outline-variant px-4 py-2 text-body-sm enabled:hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40",
  ghost: "cursor-pointer text-on-surface-variant hover:text-on-surface",
  link: "cursor-pointer text-label-sm text-secondary underline",
};

/** DESIGN.md's four button roles in one place — variants observed in existing usage plus the documented-but-unused "primary". */
export function Button({
  variant = "secondary",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...props} />;
}
