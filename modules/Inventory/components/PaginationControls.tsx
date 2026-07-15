"use client";

import { useFilterStore } from "@/shared/store/filterStore";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500];

export function PaginationControls({ totalCount }: { totalCount: number }) {
  const page = useFilterStore((s) => s.page);
  const setPage = useFilterStore((s) => s.setPage);
  const pageSize = useFilterStore((s) => s.pageSize);
  const setPageSize = useFilterStore((s) => s.setPageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="flex items-center gap-4 py-4 text-body-sm">
      <label className="flex items-center gap-2 text-on-surface-variant">
        Page size
        <select
          aria-label="Vehicles per page"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="cursor-pointer rounded border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-sm text-on-surface focus:border-secondary focus:outline-none"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="cursor-pointer rounded border border-outline-variant px-4 py-2 enabled:hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-on-surface-variant">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="cursor-pointer rounded border border-outline-variant px-4 py-2 enabled:hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
