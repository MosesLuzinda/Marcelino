import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

export default function AdmissionsPage() {
  return (
    <>
      <PageHero title="Admissions" subtitle="Join our community of excellence" />
      <section className="py-16 mx-auto max-w-4xl px-4 lg:px-8">
        <article className="card mb-8">
          <h2 className="font-display text-2xl font-bold mb-4">Application Process</h2>
          <ol className="space-y-4 list-decimal list-inside text-slate-600 dark:text-slate-300">
            <li>Complete the online application form</li>
            <li>Submit previous school records and birth certificate</li>
            <li>Attend entrance assessment/interview</li>
            <li>Receive admission decision within 2 weeks</li>
            <li>Pay enrollment fees and complete registration</li>
          </ol>
        </article>
        <section className="grid md:grid-cols-2 gap-6">
          <article className="card">
            <h3 className="font-semibold mb-2">Required Documents</h3>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Application form</li>
              <li>• Academic transcripts</li>
              <li>• Birth certificate</li>
              <li>• Passport photos (2)</li>
              <li>• Medical report</li>
            </ul>
          </article>
          <article className="card">
            <h3 className="font-semibold mb-2">Contact Admissions</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">admissions@marcelino.edu<br />+256 700 000 002</p>
            <Link href="/contact" className="btn-primary text-sm">Contact Us</Link>
          </article>
        </section>
      </section>
    </>
  );
}
