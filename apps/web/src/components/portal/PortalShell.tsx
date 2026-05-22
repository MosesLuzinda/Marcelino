"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, LogOut, Menu, Moon, Sun, Bell, Search, GraduationCap, X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";

interface NavItem { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

export function PortalShell({
  title,
  navItems,
  children,
}: {
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  if (!token) {
    router.push("/auth/login");
    return null;
  }

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-brand-950 flex">
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-brand-950 text-white transform transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <section className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 font-display font-bold">
            <GraduationCap className="h-7 w-7 text-accent-teal" />
            {title}
          </Link>
        </section>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition",
                pathname === item.href ? "bg-accent-teal/20 text-accent-teal" : "text-slate-300 hover:bg-slate-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="absolute bottom-4 left-4 right-4 flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </aside>

      {sidebarOpen && <button className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <section className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 glass border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}><Menu /></button>
          <section className="flex-1 max-w-md hidden md:flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search..." className="bg-transparent text-sm flex-1 focus:outline-none" />
          </section>
          <section className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <span className="text-sm font-medium hidden sm:block">{user?.email}</span>
          </section>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </section>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200 dark:border-slate-800 flex justify-around py-2 z-20">
        {navItems.slice(0, 4).map((item) => (
          <Link key={item.href} href={item.href} className={cn("flex flex-col items-center p-2 text-xs", pathname === item.href ? "text-accent-teal" : "text-slate-500")}>
            <item.icon className="h-5 w-5" />
            {item.label.split(" ")[0]}
          </Link>
        ))}
      </nav>
    </section>
  );
}

export function StatCard({ title, value, subtitle, icon: Icon }: { title: string; value: string | number; subtitle?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <article className="card hover:shadow-lg transition">
      <section className="flex items-start justify-between">
        <section>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </section>
        {Icon && <section className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900"><Icon className="h-6 w-6 text-brand-600" /></section>}
      </section>
    </article>
  );
}
