"use client";

import { motion } from "framer-motion";
import { ParticleField } from "@/components/premium/ParticleField";

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="relative py-32 md:py-40 mesh-hero text-white overflow-hidden">
      <ParticleField className="opacity-50" />
      <div className="absolute inset-0 grain" />
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-7xl px-4 lg:px-8 text-center"
      >
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
      </motion.section>
    </section>
  );
}
