"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = signIn(form.email, form.password);
    if (!user) {
      setError("Invalid email or password");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-mono text-sm font-bold text-black">P</div>
          <span className="font-mono text-lg font-semibold">pingtext</span>
        </Link>

        <h1 className="text-2xl font-bold text-center tracking-tight mb-2">Welcome back</h1>
        <p className="text-sm text-muted text-center mb-8">Sign in to your PingText account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5 font-mono uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-surface border border-border px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-accent"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5 font-mono uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-surface border border-border px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-accent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-black py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don&rsquo;t have an account? <Link href="/auth/signup" className="text-accent hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
