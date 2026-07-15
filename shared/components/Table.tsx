import type { ReactNode } from "react";
import { Button } from "./Button";

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** CSS width (e.g. "140px"). Omitted = flexes to fill remaining width. */
  width?: string;
  sortable?: boolean;
  cellClassName?: string;
  render: (row: T) => ReactNode;
}

export interface TableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  emptyMessage: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export function Table<T>({ rows, columns, rowKey, emptyMessage, sortBy, sortDir, onSort }: TableProps<T>) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-body-md text-on-surface-variant">{emptyMessage}</p>;
  }

  function headerContent(column: Column<T>) {
    if (!column.sortable || !onSort) return column.header;
    const ascActive = sortBy === column.key && sortDir === "asc";
    const descActive = sortBy === column.key && sortDir === "desc";
    return (
      <Button variant="ghost" className="flex items-center gap-1" onClick={() => onSort(column.key)}>
        {column.header}
        <span aria-hidden="true" className="flex flex-col text-[7px] gap-[2px] leading-none">
          <span className={ascActive ? "text-on-surface" : "text-on-surface-variant/40"}>▲</span>
          <span className={descActive ? "text-on-surface" : "text-on-surface-variant/40"}>▼</span>
        </span>
      </Button>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-outline-variant bg-surface-container-lowest">
      <table className="w-full table-fixed text-left text-body-sm">
        <colgroup>
          {columns.map((c) => (
            <col key={c.key} style={c.width ? { width: c.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-outline-variant font-mono text-label-md font-bold text-on-surface-variant">
            {columns.map((c) => (
              <th key={c.key} className="p-2">
                {headerContent(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-outline-variant hover:bg-surface-container-low">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={["truncate p-2 align-top", c.cellClassName].filter(Boolean).join(" ")}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
