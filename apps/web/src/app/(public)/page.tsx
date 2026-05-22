"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { homeCopy } from "@/lib/premium-copy";
import { ParticleField } from "@/components/premium/ParticleField";
import { ThreeOrb } from "@/components/premium/ThreeOrb";
import { SplineScene } from "@/components/premium/SplineScene";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/premium/SectionReveal";
import { MagneticButton } from "@/components/premium/MagneticButton";
import { TrustMarquee } from "@/components/premium/TrustMarquee";

export default function HomePage() {
  const c = homeCopy;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden mesh-hero">
        <ParticleField />
        <ThreeOrb className="opacity-60 max-w-[55%] right-0 left-auto hidden lg:block" />
        <div className="absolute inset-0 grain opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 dark:from-luxury-deep to-transparent" />

        <section className="relative mx-auto max-w-7xl px-4 py-28 lg:px-8 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2 text-xs font-semibold tracking-wider uppercase text-accent-teal mb-8">
                <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
                {c.hero.eyebrow}
              </span>
              <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6">
                {c.hero.title}{" "}
                <span className="text-shimmer block md:inline">{c.hero.titleAccent}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">{c.hero.subtitle}</p>
              <section className="flex flex-wrap gap-4">
                <MagneticButton href="/admissions" variant="primary">
                  {c.hero.ctaPrimary} <ArrowRight className="h-5 w-5" />
                </MagneticButton>
                <MagneticButton href="/about" variant="secondary">
                  {c.hero.ctaSecondary}
                </MagneticButton>
              </section>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:block relative h-[480px]"
            >
              <SplineScene className="h-full w-full" />
            </motion.div>
          </div>
        </section>
      </section>

      <TrustMarquee items={c.trust} />

      {/* Pillars */}
      <section className="py-28 bg-slate-50 dark:bg-luxury-deep relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.08),transparent_50%)]" />
        <section className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <SectionReveal className="text-center mb-20">
            <h2 className="section-title mb-5">{c.pillars.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{c.pillars.subtitle}</p>
          </SectionReveal>
          <StaggerGrid className="grid md:grid-cols-3 gap-8">
            {c.pillars.items.map((item) => (
              <StaggerItem key={item.title}>
                <article className="card-luxury group h-full">
                  <span className="text-xs font-bold tracking-widest uppercase text-accent-teal mb-4 block">{item.tag}</span>
                  <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-accent-teal transition-colors">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </section>

      {/* Experience bento */}
      <section className="py-28 bg-white dark:bg-slate-900/50">
        <section className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionReveal className="mb-16">
            <h2 className="section-title mb-4">{c.experience.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">{c.experience.subtitle}</p>
          </SectionReveal>
          <section className="grid md:grid-cols-4 gap-4 auto-rows-[180px]">
            {c.experience.cards.map((card, i) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`card-luxury flex flex-col justify-end ${
                  card.span === "large" ? "md:col-span-2 md:row-span-2" : card.span === "medium" ? "md:col-span-2" : ""
                } bg-gradient-to-br from-brand-950/5 to-accent-teal/10 dark:from-white/5 dark:to-accent-teal/10`}
              >
                <h3 className="font-display text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{card.desc}</p>
              </motion.article>
            ))}
          </section>
        </section>
      </section>

      {/* Spline mobile + outcomes */}
      <section className="py-28 mesh-hero text-white relative overflow-hidden">
        <ParticleField className="opacity-40" />
        <section className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SectionReveal>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">{c.outcomes.title}</h2>
              <p className="text-slate-300 text-lg mb-12">{c.outcomes.subtitle}</p>
              <div className="grid grid-cols-2 gap-6">
                {c.outcomes.stats.map((s) => (
                  <article key={s.label} className="glass-dark rounded-2xl p-6 animate-glow-pulse">
                    <p className="text-4xl font-bold text-shimmer mb-1">{s.value}</p>
                    <p className="text-sm text-slate-400">{s.label}</p>
                  </article>
                ))}
              </div>
            </SectionReveal>
            <SectionReveal delay={0.15} className="lg:hidden h-[320px]">
              <SplineScene className="h-full" />
            </SectionReveal>
          </div>
        </section>
      </section>

      {/* Testimonials */}
      <section className="py-28">
        <section className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionReveal className="text-center mb-16">
            <h2 className="section-title">{c.testimonials.title}</h2>
          </SectionReveal>
          <StaggerGrid className="grid md:grid-cols-3 gap-8">
            {c.testimonials.items.map((t) => (
              <StaggerItem key={t.name}>
                <article className="card-luxury h-full">
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-accent-teal">{t.role}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-accent-teal/80 to-brand-800" />
        <div className="absolute inset-0 grain" />
        <SectionReveal className="relative mx-auto max-w-3xl px-4 text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">{c.cta.title}</h2>
          <p className="text-slate-200 text-lg mb-10">{c.cta.subtitle}</p>
          <MagneticButton href="/admissions" variant="primary" className="!bg-white !text-brand-950 !shadow-2xl">
            {c.cta.button} <ArrowRight className="h-5 w-5" />
          </MagneticButton>
        </SectionReveal>
      </section>
    </>
  );
}
