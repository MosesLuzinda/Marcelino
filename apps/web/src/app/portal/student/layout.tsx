"use client";

import { PortalShell } from "@/components/portal/PortalShell";
import { LayoutDashboard, Calendar, ClipboardCheck, GraduationCap, FileText, MessageSquare, User, BookOpen } from "lucide-react";

const nav = [
  { href: "/portal/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/schedule", label: "Schedule", icon: Calendar },
  { href: "/portal/student/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/portal/student/grades", label: "Grades", icon: GraduationCap },
  { href: "/portal/student/assignments", label: "Assignments", icon: FileText },
  { href: "/portal/student/exams", label: "Exams", icon: BookOpen },
  { href: "/portal/student/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/student/profile", label: "Profile", icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell title="Student Portal" navItems={nav}>{children}</PortalShell>;
}
