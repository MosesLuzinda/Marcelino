import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

export default function BlogPage() {
  return (
    <>
      <PageHero title="Blog & Announcements" subtitle="Stories and updates from Marcelino" />
      <section className="py-16 mx-auto max-w-4xl px-4 lg:px-8">
        <Link href="/blog/welcome-2025" className="card block hover:shadow-lg transition">
          <h3 className="font-display text-xl font-bold">Welcome to New Academic Year</h3>
          <p className="text-slate-500 mt-2">We welcome all students for an exciting 2025-2026 academic year...</p>
        </Link>
      </section>
    </>
  );
}
