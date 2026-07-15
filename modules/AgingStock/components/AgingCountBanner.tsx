export function AgingCountBanner({ agingCount }: { agingCount: number }) {
  return (
    <div
      role="status"
      className="flex w-fit min-w-[220px] flex-col gap-1 rounded border border-amber-300 bg-amber-50 px-6 py-4"
    >
      <span className="font-mono text-label-sm text-amber-900">Aging Stock (&gt;90 days)</span>
      <span className="font-headline text-headline-lg text-amber-900">
        {agingCount} {agingCount === 1 ? "vehicle" : "vehicles"}
      </span>
    </div>
  );
}
