"use client";

import { Select } from "../elements/Select";
import { Button } from "../elements/Button";

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (pageSize: number) => void;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center gap-4 py-4 text-body-sm">
      <Select
        label="Page size"
        aria-label="Vehicles per page"
        value={pageSize}
        onChange={(size) => size !== undefined && onPageSizeChange(size)}
        options={pageSizeOptions.map((size) => ({ value: size, label: String(size) }))}
      />
      <Button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
        Previous
      </Button>
      <span className="text-on-surface-variant">
        Page {page} of {totalPages}
      </span>
      <Button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
        Next
      </Button>
    </div>
  );
}
