import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-300">
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <section className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <section>
            <p className="flex items-center gap-2 text-white font-display text-xl font-bold mb-4">
              <GraduationCap className="h-8 w-8 text-accent-teal" />
              Marcelino Academy
            </p>
            <p className="text-sm">Excellence Through Education. Nurturing future leaders since 1998.</p>
          </section>
          <section>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About" },
                { href: "/admissions", label: "Admissions" },
                { href: "/academics", label: "Academics" },
                { href: "/careers", label: "Careers" },
                { href: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent-teal transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="font-semibold text-white mb-4">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/portal/student" className="hover:text-accent-teal">Student Portal</Link></li>
              <li><Link href="/portal/teacher" className="hover:text-accent-teal">Teacher Portal</Link></li>
              <li><Link href="/portal/parent" className="hover:text-accent-teal">Parent Portal</Link></li>
              <li><Link href="/portal/admin" className="hover:text-accent-teal">Admin Portal</Link></li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent-teal shrink-0" /> Kampala, Uganda</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent-teal shrink-0" /> +256 700 000 001</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent-teal shrink-0" /> info@marcelino.edu</li>
            </ul>
          </section>
        </section>
        <p className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          © {new Date().getFullYear()} Marcelino International Academy. All rights reserved.
        </p>
      </section>
    </footer>
  );
}
