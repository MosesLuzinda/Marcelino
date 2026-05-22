"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { siteMap } from "@/lib/premium-copy";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark py-3 shadow-2xl" : "bg-transparent py-5"
      }`}
    >
      <motion.div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-950 dark:text-white group">
          <GraduationCap className="h-8 w-8 text-accent-teal group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Marcelino</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {siteMap.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-accent-teal dark:text-slate-300 dark:hover:text-accent-teal transition relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent-teal after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <section className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2.5 hover:bg-white/10 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link href="/auth/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-accent-teal transition">
            Login
          </Link>
          <Link href="/admissions" className="btn-primary text-sm !py-2.5 !px-6">
            Apply Now
          </Link>
        </section>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </motion.div>

      {open && (
        <nav className="lg:hidden glass-dark border-t border-white/10 px-4 py-6 flex flex-col gap-4">
          {siteMap.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-2 font-medium text-lg">
              {link.label}
            </Link>
          ))}
          <Link href="/admissions" className="btn-primary text-center" onClick={() => setOpen(false)}>
            Apply Now
          </Link>
        </nav>
      )}
    </header>
  );
}
