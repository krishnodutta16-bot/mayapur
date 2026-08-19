"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function MemoryForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/timeline", {
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
      <h2 className="font-display text-xl">নতুন স্মৃতি</h2>
      <input name="title" placeholder="শিরোনাম" required />
      <input name="place" placeholder="জায়গা" />
      <input name="happenedAt" type="date" required />
      <textarea name="body" rows={4} placeholder="সেই দিনের গল্প..." required />
      {error ? <p className="text-sm text-primary">{error}</p> : null}
      <button disabled={loading} className="btn-dream rounded-full px-6 py-3 font-semibold">
        {loading ? "রাখা হচ্ছে..." : "টাইমলাইনে রাখো"}
      </button>
    </form>
  );
}
