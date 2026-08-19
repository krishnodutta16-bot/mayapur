"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function PhotoForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const res = await fetch("/api/photos", { method: "POST", body: new FormData(form) });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "Could not upload.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel space-y-3 rounded-3xl p-6">
      <h2 className="font-display text-xl">ছবি যোগ করো</h2>
      <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required />
      <input name="title" placeholder="শিরোনাম" required />
      <input name="place" placeholder="জায়গা" />
      <input name="happenedAt" type="date" required />
      <textarea name="caption" rows={3} placeholder="ক্যাপশন / ছোট্ট নোট" />
      {error ? <p className="text-sm text-primary">{error}</p> : null}
      <button disabled={loading} className="btn-dream rounded-full px-6 py-3 font-semibold">
        {loading ? "আপলোড হচ্ছে..." : "গ্যালারিতে রাখো"}
      </button>
    </form>
  );
}
