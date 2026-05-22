"use client";

import { Loader2, AlertCircle } from "lucide-react";

export function PortalPageShell({
  title,
  description,
  loading,
  error,
  empty,
  emptyMessage = "No data available yet.",
  children,
}: {
  title: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </header>

      {loading && (
        <article className="card flex items-center justify-center gap-3 py-12 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-accent-teal" />
          Loading...
        </article>
      )}

      {!loading && error && (
        <article className="card flex items-start gap-3 py-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </article>
      )}

      {!loading && !error && empty && (
        <article className="card py-12 text-center text-slate-500">{emptyMessage}</article>
      )}

      {!loading && !error && !empty && children}
    </section>
  );
}
