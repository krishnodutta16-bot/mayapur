"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AnniversaryForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/anniversaries", {
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
      <h2 className="font-display text-xl">তারিখ যোগ করো</h2>
      <input name="title" placeholder="প্রথম দেখা / বিয়ে / জন্মদিন" required />
      <select name="kind" defaultValue="anniversary">
        <option value="first_meet">প্রথম দেখা</option>
        <option value="anniversary">বার্ষিকী</option>
        <option value="birthday">জন্মদিন</option>
        <option value="other">অন্যান্য</option>
      </select>
      <input name="date" type="date" required />
      <textarea name="note" rows={3} placeholder="একটা নোট" />
      {error ? <p className="text-sm text-primary">{error}</p> : null}
      <button disabled={loading} className="btn-dream rounded-full px-6 py-3 font-semibold">
        {loading ? "রাখা হচ্ছে..." : "রিমাইন্ডার রাখো"}
      </button>
    </form>
  );
}
