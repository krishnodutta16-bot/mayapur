export function daysUntilNext(from: Date, now = new Date()) {
  const next = new Date(now.getFullYear(), from.getMonth(), from.getDate());
  if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    next.setFullYear(now.getFullYear() + 1);
  }
  const ms = next.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round(ms / 86400000);
}

export function daysTogether(since: Date, now = new Date()) {
  const start = new Date(since.getFullYear(), since.getMonth(), since.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000));
}

export function formatBnDate(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
}
