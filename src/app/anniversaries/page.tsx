import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { daysUntilNext, formatBnDate } from "@/lib/dates";
import { Shell } from "@/components/Shell";
import { AnniversaryForm } from "@/components/AnniversaryForm";
import { TogetherForm } from "@/components/TogetherForm";

const kindLabel: Record<string, string> = {
  first_meet: "প্রথম দেখা",
  anniversary: "বার্ষিকী",
  birthday: "জন্মদিন",
  other: "অন্যান্য",
};

export default async function AnniversariesPage() {
  const user = await requireSession();
  if (!user) redirect("/login");
  const [setting, items] = await Promise.all([
    prisma.setting.findUnique({ where: { id: "couple" } }),
    prisma.anniversary.findMany(),
  ]);
  const sorted = items
    .map((d) => ({ ...d, inDays: daysUntilNext(d.date) }))
    .sort((a, b) => a.inDays - b.inDays);
  const today = sorted.filter((d) => d.inDays === 0);
  const soon = sorted.filter((d) => d.inDays > 0 && d.inDays <= 30);

  return (
    <Shell name={user.name}>
      <h1 className="font-display text-4xl text-dream">ভালোবাসার ক্যালেন্ডার</h1>
      <p className="mt-2 text-muted-foreground">প্রথম দেখা, জন্মদিন, বার্ষিকী — আর কত দিন বাকি।</p>

      <div className="glass-panel mt-8 rounded-3xl p-6">
        <p className="font-display text-xl">একসাথে কতদিন</p>
        <TogetherForm togetherSince={setting ? setting.togetherSince.toISOString().slice(0, 10) : ""} />
      </div>

      {(today.length > 0 || soon.length > 0) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {today.map((d) => (
            <article key={d.id} className="glass-panel rounded-2xl border-primary/40 p-5">
              <p className="text-xs text-primary">আজকের দিন</p>
              <p className="font-display mt-1 text-2xl">{d.title}</p>
            </article>
          ))}
          {soon.map((d) => (
            <article key={d.id} className="glass-panel rounded-2xl p-5">
              <p className="text-xs text-primary">শীঘ্রই · {d.inDays} দিন</p>
              <p className="font-display mt-1 text-2xl">{d.title}</p>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <AnniversaryForm />
        <div className="space-y-4">
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">প্রিয় তারিখগুলো এখানে জমা রাখো।</p>
          ) : (
            sorted.map((d) => (
              <article key={d.id} className="glass-panel rounded-2xl p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl">{d.title}</h2>
                  <span className="text-primary">{d.inDays === 0 ? "আজই" : `${d.inDays} দিন বাকি`}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {kindLabel[d.kind] || d.kind} · {formatBnDate(d.date)}
                </p>
                {d.note ? <p className="mt-3 text-sm">{d.note}</p> : null}
              </article>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}
