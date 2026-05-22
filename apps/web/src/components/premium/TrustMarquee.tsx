"use client";

export function TrustMarquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-luxury-deep/80 py-4">
      <div className="flex animate-marquee whitespace-nowrap gap-12">
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-medium tracking-widest uppercase text-slate-400 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
