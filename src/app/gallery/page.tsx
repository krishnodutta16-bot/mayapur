import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatBnDate } from "@/lib/dates";
import { Shell } from "@/components/Shell";
import { PhotoForm } from "@/components/PhotoForm";

export default async function GalleryPage() {
  const user = await requireSession();
  if (!user) redirect("/login");
  const photos = await prisma.photo.findMany({
    orderBy: { happenedAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

  return (
    <Shell name={user.name}>
      <h1 className="font-display text-4xl text-dream">স্মৃতির গ্যালারি</h1>
      <p className="mt-2 text-muted-foreground">ছবিগুলো ক্যামেরা রোলে হারিয়ে যাবে না।</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <PhotoForm />
        <div className="grid gap-6 sm:grid-cols-2">
          {photos.length === 0 ? (
            <p className="text-sm text-muted-foreground">প্রথম ছবিটা তুলে রাখো।</p>
          ) : (
            photos.map((p) => (
              <figure key={p.id} className="glass-panel overflow-hidden rounded-3xl">
                <img
                  src={`/api/photos/${p.id}/file`}
                  alt={p.title}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <figcaption className="p-5">
                  <p className="font-display text-xl">{p.title}</p>
                  <p className="mt-1 text-xs text-primary">{formatBnDate(p.happenedAt)}</p>
                  {p.place ? <p className="text-sm text-muted-foreground">{p.place}</p> : null}
                  {p.caption ? <p className="mt-2 text-sm leading-relaxed">{p.caption}</p> : null}
                  <p className="mt-2 text-xs text-muted-foreground">— {p.createdBy.name}</p>
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}
