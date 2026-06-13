import React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No records found.",
  className,
}: TableProps<T>) {
  return (
    <div className={cn("border border-white/10 rounded-xl overflow-hidden bg-slate-900", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/80 border-b border-white/10">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/[0.02] transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn("px-6 py-4 text-sm text-slate-300", col.className)}>
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
