"use client";

import { PortalShell } from "@/components/portal/PortalShell";
import { LayoutDashboard, Users, ClipboardCheck, GraduationCap, FileText, BarChart3, Video, MessageSquare } from "lucide-react";

const nav = [
  { href: "/portal/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/teacher/classes", label: "My Classes", icon: Users },
  { href: "/portal/teacher/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/portal/teacher/grades", label: "Grades", icon: GraduationCap },
  { href: "/portal/teacher/assignments", label: "Assignments", icon: FileText },
  { href: "/portal/teacher/exams", label: "Exams", icon: FileText },
  { href: "/portal/teacher/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/teacher/live-class", label: "Live Class", icon: Video },
  { href: "/portal/teacher/messages", label: "Messages", icon: MessageSquare },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell title="Teacher Portal" navItems={nav}>{children}</PortalShell>;
}
