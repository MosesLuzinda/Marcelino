"use client";

import { PortalShell } from "@/components/portal/PortalShell";
import { LayoutDashboard, Users, ClipboardCheck, GraduationCap, CreditCard, MessageSquare, Bell } from "lucide-react";

const nav = [
  { href: "/portal/parent", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/parent/children", label: "My Children", icon: Users },
  { href: "/portal/parent/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/portal/parent/performance", label: "Performance", icon: GraduationCap },
  { href: "/portal/parent/fees", label: "Fees & Payments", icon: CreditCard },
  { href: "/portal/parent/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/parent/notifications", label: "Notifications", icon: Bell },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell title="Parent Portal" navItems={nav}>{children}</PortalShell>;
}
