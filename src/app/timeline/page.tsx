import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatBnDate } from "@/lib/dates";
import { Shell } from "@/components/Shell";
import { MemoryForm } from "@/components/MemoryForm";

export default async function TimelinePage() {
  const user = await requireSession();
  if (!user) redirect("/login");
  const items = await prisma.memory.findMany({
    orderBy: { happenedAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

  return (
    <Shell name={user.name}>
      <h1 className="font-display text-4xl text-dream">স্মৃতির টাইমলাইন</h1>
      <p className="mt-2 text-muted-foreground">প্রতিটি মুহূর্ত তার তারিখ, জায়গা আর গল্প নিয়ে।</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <MemoryForm />
        <ol className="relative space-y-6 border-l border-primary/30 pl-6">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">এখনো খালি — প্রথম স্মৃতিটা লিখে রাখো।</p>
          ) : (
            items.map((item) => (
              <li key={item.id} className="glass-panel relative rounded-2xl p-5">
                <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-primary" />
                <p className="text-xs tracking-wide text-primary">{formatBnDate(item.happenedAt)}</p>
                <h2 className="font-display mt-1 text-xl">{item.title}</h2>
                {item.place ? <p className="text-sm text-muted-foreground">{item.place}</p> : null}
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{item.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">— {item.createdBy.name}</p>
              </li>
            ))
          )}
        </ol>
      </div>
    </Shell>
  );
}
