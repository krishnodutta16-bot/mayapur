import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatBnDate } from "@/lib/dates";
import { Shell } from "@/components/Shell";
import { NoteForm } from "@/components/NoteForm";

export default async function NotesPage() {
  const user = await requireSession();
  if (!user) redirect("/login");
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

  return (
    <Shell name={user.name}>
      <h1 className="font-display text-4xl text-dream">গোপন চিরকুট</h1>
      <p className="mt-2 text-muted-foreground">তোমার জন্য লেখা চিঠি — মুছে যায় না, শুধু পড়া যায়।</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <NoteForm />
        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">প্রথম চিরকুটটা লিখে রাখো।</p>
          ) : (
            notes.map((n) => (
              <article key={n.id} className="glass-panel rounded-3xl p-6">
                <p className="text-xs text-primary">{formatBnDate(n.createdAt)}</p>
                <h2 className="font-display mt-1 text-xl">{n.title}</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{n.body}</p>
                <p className="mt-4 text-xs tracking-[0.2em] text-primary">— {n.createdBy.name}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}
