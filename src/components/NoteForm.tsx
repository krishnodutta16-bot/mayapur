"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function NoteForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "Could not save.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel space-y-3 rounded-3xl p-6">
      <h2 className="font-display text-xl">নতুন চিরকুট</h2>
      <input name="title" placeholder="শিরোনাম" required />
      <textarea name="body" rows={6} placeholder="প্রিয়..." required />
      {error ? <p className="text-sm text-primary">{error}</p> : null}
      <p className="text-xs text-muted-foreground">একবার লিখলে মুছে যাবে না — শুধু আবার পড়া যাবে।</p>
      <button disabled={loading} className="btn-dream rounded-full px-6 py-3 font-semibold">
        {loading ? "লিখা হচ্ছে..." : "চিঠি রাখো"}
      </button>
    </form>
  );
}
