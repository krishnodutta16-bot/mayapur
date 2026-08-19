"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not open the gate.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      <p className="animate-rise-in text-sm tracking-[0.4em] text-muted-foreground">MAYAPUR</p>
      <h1 className="animate-glow-pulse font-display mt-4 text-6xl text-dream sm:text-8xl">মায়াপুর</h1>
      <p className="mt-4 max-w-md text-center text-muted-foreground">
        আমাদের স্বপ্নের রাজ্য। দুজনের ইমেইল ছাড়া কেউ ঢুকতে পারবে না।
      </p>
      <form onSubmit={onSubmit} className="glass-panel mt-10 w-full max-w-md space-y-4 rounded-3xl p-8">
        <label className="block text-sm">
          ইমেইল
          <input className="mt-2" name="email" type="email" autoComplete="username" required />
        </label>
        <label className="block text-sm">
          পাসওয়ার্ড
          <input className="mt-2" name="password" type="password" autoComplete="current-password" required minLength={8} />
        </label>
        {error ? <p className="text-sm text-primary">{error}</p> : null}
        <button
          disabled={loading}
          className="btn-dream inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-transform hover:scale-105 disabled:opacity-60"
        >
          <Sparkle className="h-5 w-5" />
          {loading ? "খুলছে..." : "Enter Mayapur"}
        </button>
      </form>
    </main>
  );
}
