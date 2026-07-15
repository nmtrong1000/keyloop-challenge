export function LoadingOverlay({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-surface/60">
      <span className="text-body-sm text-on-surface-variant">{message}</span>
    </div>
  );
}
