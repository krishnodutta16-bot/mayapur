"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function TogetherForm({ togetherSince }: { togetherSince: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ togetherSince: form.get("togetherSince") }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-3">
      <label className="text-sm">
        একসাথে শুরু
        <input className="mt-2" name="togetherSince" type="date" defaultValue={togetherSince} />
      </label>
      <button disabled={loading} className="btn-dream rounded-full px-5 py-3 text-sm font-semibold">
        সেভ
      </button>
    </form>
  );
}
