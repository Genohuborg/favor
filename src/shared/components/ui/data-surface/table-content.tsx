"use client";

import { cn } from "@infra/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import {
  flexRender,
  type Row,
  type SortingState,
  type Table,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Info, Search } from "lucide-react";
import * as React from "react";
import type { ColumnMeta } from "./types";

interface TableContentProps<TData> {
  table: Table<TData>;
  /** Pre-computed rows from table.getRowModel() - pass from parent to avoid stale memoization */
  rows: Row<TData>[];
  onRowClick?: (row: Row<TData>) => void;
  emptyMessage?: string;
  loading?: boolean;
  /** Sorting state - used to determine sort icons */
  sorting: SortingState;
  /** ID of the currently expanded row */
  expandedRowId?: string | null;
  /** Render expanded content below the row */
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
}

function SortIcon({
  columnId,
  sorting,
}: {
  columnId: string;
  sorting: SortingState;
}) {
  const sortEntry = sorting.find((s) => s.id === columnId);
  if (sortEntry?.desc === false)
    return <ArrowUp className="w-3.5 h-3.5 text-primary" />;
  if (sortEntry?.desc === true)
    return <ArrowDown className="w-3.5 h-3.5 text-primary" />;
  return (
    <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
  );
}

export function TableContent<TData>({
  table,
  rows,
  onRowClick,
  emptyMessage = "No data found",
  loading = false,
  sorting,
  expandedRowId,
  renderExpandedRow,
}: TableContentProps<TData>) {
  return (
    <div className="overflow-x-auto relative">
      {loading && (
        <div className="absolute inset-0 bg-background/60 z-10 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      <table className="min-w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | ColumnMeta
                  | undefined;
                const canSort = header.column.getCanSort();
                const align = meta?.align ?? "left";

                return (
                  <th
                    key={header.id}
                    scope="col"
                    colSpan={header.colSpan}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={cn(
                      "px-4 py-2.5 bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
                      align === "center" && "text-center",
                      align === "right" && "text-right",
                      canSort &&
                        "cursor-pointer select-none hover:text-foreground hover:bg-muted transition-colors",
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          align === "center" && "justify-center",
                          align === "right" && "justify-end",
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {meta?.description && (
                          <TooltipProvider>
                            <Tooltip delayDuration={200}>
                              <TooltipTrigger asChild>
                                <span
                                  className="inline-flex"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help transition-colors" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="max-w-xs text-sm"
                              >
                                {meta.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {canSort && (
                          <SortIcon
                            columnId={header.column.id}
                            sorting={sorting}
                          />
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => {
              const isEven = index % 2 === 0;
              const isExpanded = expandedRowId === row.id;
              return (
                <React.Fragment key={row.id}>
                  <tr
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "group relative transition-colors border-b border-border/50",
                      isExpanded
                        ? "bg-primary/5"
                        : isEven
                          ? "bg-background"
                          : "bg-muted/30",
                      onRowClick ? "cursor-pointer" : "",
                      "hover:bg-primary/[0.03]",
                    )}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const meta = cell.column.columnDef.meta as
                        | ColumnMeta
                        | undefined;
                      const align = meta?.align ?? "left";

                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            "px-4 py-2.5 text-xs text-foreground",
                            align === "center" && "text-center",
                            align === "right" && "text-right",
                            cellIndex === 0 && "relative",
                          )}
                        >
                          {cellIndex === 0 && (
                            <div
                              className={cn(
                                "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r transition-all duration-150",
                                isExpanded
                                  ? "h-6 bg-primary"
                                  : "h-0 bg-primary/60 group-hover:h-6",
                              )}
                            />
                          )}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {isExpanded && renderExpandedRow && (
                    <tr>
                      <td
                        colSpan={row.getVisibleCells().length}
                        className="bg-muted/30 border-b border-border/50 px-6 py-0"
                      >
                        {renderExpandedRow(row)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : !loading ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="px-6 py-12 text-center text-muted-foreground text-sm"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Search className="w-8 h-8 text-muted-foreground/30" />
                  <p>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
