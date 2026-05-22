"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";
import { Video } from "lucide-react";

type Slot = { dayOfWeek: string; startTime: string; endTime: string; subject: { name: string }; meetLink?: string };

export default function TeacherLiveClassPage() {
  const { data: classes } = usePortalApi<{ class: { name: string } }[]>("/teacher/classes");
  const className = classes?.[0]?.class?.name || "Grade 10A";

  const schedule: Slot[] = [
    { dayOfWeek: "Today", startTime: "08:00", endTime: "09:00", subject: { name: "Mathematics" }, meetLink: "https://meet.google.com/demo-math" },
    { dayOfWeek: "Today", startTime: "10:00", endTime: "11:00", subject: { name: "Physics" }, meetLink: "https://meet.google.com/demo-physics" },
  ];

  return (
    <PortalPageShell title="Live Class" description={`Virtual sessions for ${className}`}>
      <section className="space-y-3">
        {schedule.map((s, i) => (
          <article key={i} className="card flex flex-wrap justify-between items-center gap-4">
            <section>
              <p className="font-semibold">{s.subject.name}</p>
              <p className="text-sm text-slate-500">{s.startTime} – {s.endTime}</p>
            </section>
            {s.meetLink && (
              <a href={s.meetLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm inline-flex items-center gap-2">
                <Video className="h-4 w-4" /> Join class
              </a>
            )}
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
