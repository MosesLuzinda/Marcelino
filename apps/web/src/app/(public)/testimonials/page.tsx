import { PageHero } from "@/components/public/PageHero";
import { Star } from "lucide-react";

export default function TestimonialsPage() {
  const items = [
    { name: "Sarah Nakato", role: "Parent", text: "Marcelino has transformed my daughter's education." },
    { name: "David Okello", role: "Alumni", text: "The foundation I received prepared me for university and beyond." },
    { name: "Grace Mwangi", role: "Parent", text: "The parent portal makes fee payments and tracking so easy." },
  ];
  return (
    <>
      <PageHero title="Testimonials" subtitle="Voices from our community" />
      <section className="py-16 mx-auto max-w-7xl px-4 lg:px-8 grid md:grid-cols-3 gap-8">
        {items.map((t) => (
          <article key={t.name} className="card">
            <section className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent-gold text-accent-gold" />)}</section>
            <p className="italic text-slate-600 dark:text-slate-300 mb-4">&ldquo;{t.text}&rdquo;</p>
            <p className="font-semibold">{t.name}</p>
            <p className="text-sm text-slate-500">{t.role}</p>
          </article>
        ))}
      </section>
    </>
  );
}
