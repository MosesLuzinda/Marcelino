"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Slot = {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room?: string;
  subject: { name: string };
  teacher?: { user: { firstName: string; lastName: string } };
};

export default function StudentSchedulePage() {
  const { data, loading, error } = usePortalApi<Slot[]>("/student/schedule");
  const slots = data || [];

  return (
    <PortalPageShell title="Class Schedule" description="Your weekly timetable" loading={loading} error={error} empty={slots.length === 0}>
      <article className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left p-3">Day</th>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Teacher</th>
              <th className="text-left p-3">Room</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-3 font-medium">{s.dayOfWeek}</td>
                <td className="p-3">{s.startTime} – {s.endTime}</td>
                <td className="p-3">{s.subject.name}</td>
                <td className="p-3">{s.teacher ? `${s.teacher.user.firstName} ${s.teacher.user.lastName}` : "—"}</td>
                <td className="p-3">{s.room || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </PortalPageShell>
  );
}
