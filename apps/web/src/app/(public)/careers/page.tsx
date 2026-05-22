import { PageHero } from "@/components/public/PageHero";

export default function CareersPage() {
  return (
    <>
      <PageHero title="Careers" subtitle="Join our team of educators" />
      <section className="py-16 mx-auto max-w-4xl px-4 lg:px-8">
        <article className="card">
          <h3 className="font-display text-xl font-bold">Mathematics Teacher</h3>
          <p className="text-accent-teal text-sm mb-4">Sciences Department · Full-time</p>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Seeking experienced mathematics teacher for senior classes. Bachelor&apos;s degree required, 3+ years experience preferred.</p>
          <a href="mailto:careers@marcelino.edu" className="btn-primary text-sm">Apply via Email</a>
        </article>
      </section>
    </>
  );
}
