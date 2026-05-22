"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Notification = { id: string; title: string; body: string; read: boolean; createdAt: string };

export default function ParentNotificationsPage() {
  const { data, loading, error } = usePortalApi<Notification[]>("/parent/notifications");
  const items = data || [];

  return (
    <PortalPageShell title="Notifications" description="School alerts and updates" loading={loading} error={error} empty={items.length === 0}>
      <section className="space-y-3">
        {items.map((n) => (
          <article key={n.id} className={`card ${!n.read ? "border-l-4 border-accent-teal" : ""}`}>
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-slate-500 mt-1">{n.body}</p>
            <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
