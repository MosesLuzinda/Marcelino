"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Setting = { key: string; value: string };

export default function AdminSettingsPage() {
  const { data, loading, error } = usePortalApi<Setting[]>("/admin/settings");
  const settings = data || [];

  return (
    <PortalPageShell title="Settings" description="School configuration" loading={loading} error={error} empty={settings.length === 0}>
      <article className="card divide-y divide-slate-100 dark:divide-slate-800">
        {settings.map((s) => (
          <section key={s.key} className="flex justify-between py-4 gap-4">
            <span className="text-sm font-medium text-slate-500">{s.key}</span>
            <span className="text-sm font-semibold">{s.value}</span>
          </section>
        ))}
      </article>
    </PortalPageShell>
  );
}
