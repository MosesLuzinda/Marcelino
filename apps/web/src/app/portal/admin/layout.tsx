"use client";

import { PortalShell } from "@/components/portal/PortalShell";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CreditCard, BarChart3,
  Settings, Library, Building, Bus, Package, Briefcase,
} from "lucide-react";

const nav = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/students", label: "Students", icon: Users },
  { href: "/portal/admin/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/portal/admin/classes", label: "Classes", icon: BookOpen },
  { href: "/portal/admin/fees", label: "Finance", icon: CreditCard },
  { href: "/portal/admin/payroll", label: "Payroll", icon: Briefcase },
  { href: "/portal/admin/library", label: "Library", icon: Library },
  { href: "/portal/admin/hostel", label: "Hostel", icon: Building },
  { href: "/portal/admin/transport", label: "Transport", icon: Bus },
  { href: "/portal/admin/inventory", label: "Inventory", icon: Package },
  { href: "/portal/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/portal/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell title="Admin Portal" navItems={nav}>{children}</PortalShell>;
}
