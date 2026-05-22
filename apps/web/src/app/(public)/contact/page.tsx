"use client";

import { useState } from "react";
import { PageHero } from "@/components/public/PageHero";
import { api } from "@/lib/api";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await api("/public/contact", { method: "POST", body: JSON.stringify(form) });
    setSent(true);
  }

  return (
    <>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you" />
      <section className="py-16 mx-auto max-w-7xl px-4 lg:px-8 grid lg:grid-cols-2 gap-12">
        <article className="space-y-6">
          {[
            { icon: MapPin, text: "Plot 42, Education Avenue, Kampala, Uganda" },
            { icon: Phone, text: "+256 700 000 001" },
            { icon: Mail, text: "info@marcelino.edu" },
          ].map(({ icon: Icon, text }) => (
            <p key={text} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Icon className="h-5 w-5 text-accent-teal shrink-0" /> {text}
            </p>
          ))}
        </article>
        <form onSubmit={submit} className="card space-y-4">
          {sent ? (
            <p className="text-green-600 font-medium">Thank you! We&apos;ll get back to you soon.</p>
          ) : (
            <>
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border px-4 py-3 bg-transparent" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border px-4 py-3 bg-transparent" />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border px-4 py-3 bg-transparent" />
              <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border px-4 py-3 bg-transparent" />
              <textarea required rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border px-4 py-3 bg-transparent" />
              <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
            </>
          )}
        </form>
      </section>
    </>
  );
}
