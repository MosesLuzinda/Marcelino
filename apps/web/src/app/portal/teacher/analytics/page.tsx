"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Analytics = { subject: string; average: number; atRisk: boolean };

export default function TeacherAnalyticsPage() {
  const { data, loading, error } = usePortalApi<Analytics[]>("/teacher/analytics");
  const chartData = (data || []).map((d) => ({ subject: d.subject, average: Math.round(d.average) }));

  return (
    <PortalPageShell title="Analytics" description="Student performance insights" loading={loading} error={error} empty={!chartData.length}>
      <article className="card">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="average" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </article>
    </PortalPageShell>
  );
}
