"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth, getPortalPath } from "@/store/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api<{ accessToken: string; user: { userId: string; email: string; roles: string[]; permissions: string[] } }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      );
      if (!res.success || !res.data) throw new Error(res.error || "Login failed");
      setAuth(res.data.accessToken, res.data.user);
      localStorage.setItem("accessToken", res.data.accessToken);
      router.push(getPortalPath(res.data.user.roles));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
    setLoading(false);
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-brand-800 to-accent-teal/20 p-4">
      <article className="w-full max-w-md card glass">
        <section className="text-center mb-8">
          <GraduationCap className="h-12 w-12 text-accent-teal mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your portal</p>
        </section>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none" placeholder="you@marcelino.edu" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Demo: admin@marcelino.edu / Admin@123456
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/" className="text-brand-600 hover:underline">← Back to website</Link>
        </p>
      </article>
    </section>
  );
}
