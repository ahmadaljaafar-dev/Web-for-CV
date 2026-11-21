"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ahmato-123@hotmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach server.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-graphite-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-graphite-700 bg-graphite-900 p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-electric-glow">
          Protected Area
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-warm-white">Admin Sign In</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="block font-mono text-xs text-warm-muted">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-warm-white"
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="block font-mono text-xs text-warm-muted">
              Password
            </label>
            <input
              id="admin-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-warm-white"
            />
          </div>
          {error && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-electric px-4 py-2.5 text-sm font-medium text-white hover:bg-electric-bright disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="font-mono text-xs text-warm-muted hover:text-warm-white">
            ← Back to public portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
