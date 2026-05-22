import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

export default function NewsPage() {
  const posts = [
    { title: "Welcome to New Academic Year", slug: "welcome-2025", excerpt: "Exciting year ahead for all students", date: "Sep 1, 2025" },
    { title: "Science Fair Winners Announced", slug: "science-fair-2025", excerpt: "Celebrating student innovation", date: "Oct 15, 2025" },
  ];
  return (
    <>
      <PageHero title="News & Events" subtitle="Latest from our school community" />
      <section className="py-16 mx-auto max-w-4xl px-4 lg:px-8 space-y-6">
        {posts.map((p) => (
          <article key={p.slug} className="card hover:shadow-lg transition">
            <p className="text-sm text-slate-500 mb-2">{p.date}</p>
            <h3 className="font-display text-xl font-bold mb-2">{p.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{p.excerpt}</p>
            <Link href={`/blog/${p.slug}`} className="text-brand-600 font-medium hover:underline">Read more →</Link>
          </article>
        ))}
      </section>
    </>
  );
}
