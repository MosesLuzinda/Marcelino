"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

export function AdminTablePage({
  title,
  description,
  path,
  columns,
  getRowKey,
  renderRow,
}: {
  title: string;
  description?: string;
  path: string;
  columns: string[];
  getRowKey: (row: Record<string, unknown>, index: number) => string;
  renderRow: (row: Record<string, unknown>) => React.ReactNode[];
}) {
  const { data, loading, error } = usePortalApi<Record<string, unknown>[]>(path);
  const rows = data || [];

  return (
    <PortalPageShell title={title} description={description} loading={loading} error={error} empty={rows.length === 0}>
      <article className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((c) => (
                <th key={c} className="text-left p-3">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={getRowKey(row, i)} className="border-b border-slate-100 dark:border-slate-800">
                {renderRow(row).map((cell, j) => (
                  <td key={j} className="p-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </PortalPageShell>
  );
}
