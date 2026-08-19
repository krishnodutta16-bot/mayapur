import Link from "next/link";
import { redirect } from "next/navigation";
import { BookHeart, CalendarHeart, Images, Sparkle } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { daysTogether, daysUntilNext, formatBnDate } from "@/lib/dates";
import { Shell } from "@/components/Shell";

export default async function HomePage() {
  const user = await requireSession();
  if (!user) redirect("/login");

  const [setting, photos, memoryCount, photoCount, dates] = await Promise.all([
    prisma.setting.findUnique({ where: { id: "couple" } }),
    prisma.photo.findMany({ orderBy: { happenedAt: "desc" }, take: 4 }),
    prisma.memory.count(),
    prisma.photo.count(),
    prisma.anniversary.findMany(),
  ]);

  const days = setting ? daysTogether(setting.togetherSince) : 0;
  const upcoming = dates
    .map((d) => ({ ...d, inDays: daysUntilNext(d.date) }))
    .sort((a, b) => a.inDays - b.inDays)
    .slice(0, 3);

  return (
    <Shell name={user.name}>
      <section className="text-center">
        <p className="text-sm tracking-[0.4em] text-muted-foreground">MAYAPUR</p>
        <h1 className="animate-glow-pulse font-display mt-3 text-5xl text-dream sm:text-7xl">মায়াপুর</h1>
        <p className="mt-4 text-muted-foreground">
          {setting?.homeQuote || "আমাদের স্বপ্নের রাজ্য, যেখানে প্রতিটি স্মৃতি বেঁচে থাকবে।"}
        </p>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <article className="glass-panel rounded-3xl p-6">
          <p className="text-sm text-muted-foreground">একসাথে</p>
          <p className="font-display mt-2 text-4xl text-primary">{days}</p>
          <p className="text-sm text-muted-foreground">দিন</p>
        </article>
        <article className="glass-panel rounded-3xl p-6">
          <p className="text-sm text-muted-foreground">স্মৃতি</p>
          <p className="font-display mt-2 text-4xl text-primary">{memoryCount}</p>
          <p className="text-sm text-muted-foreground">টাইমলাইনে</p>
        </article>
        <article className="glass-panel rounded-3xl p-6">
          <p className="text-sm text-muted-foreground">ছবি</p>
          <p className="font-display mt-2 text-4xl text-primary">{photoCount}</p>
          <p className="text-sm text-muted-foreground">গ্যালারিতে</p>
        </article>
      </div>

      <div className="glass-panel mt-8 overflow-hidden rounded-3xl">
        <img
          src="/mayapur-night.jpg"
          alt="মায়াপুরের চাঁদনি রাতের আকাশ"
          className="h-64 w-full object-cover sm:h-80"
        />
        <div className="p-6 text-left">
          <p className="font-display text-xl">প্রথম দেখা</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {setting ? `শুরু ${formatBnDate(setting.togetherSince)} থেকে।` : "তারিখ সেট করো বার্ষিকী পাতায়।"}
          </p>
        </div>
      </div>

      <h2 className="font-display mt-12 text-3xl">কাছাকাছি দিনগুলো</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">এখনো কোনো বার্ষিকী নেই — যোগ করো প্রিয় তারিখগুলো।</p>
        ) : (
          upcoming.map((d) => (
            <article key={d.id} className="glass-panel rounded-2xl p-5">
              <p className="font-display text-lg">{d.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{formatBnDate(d.date)}</p>
              <p className="mt-3 text-primary">{d.inDays === 0 ? "আজই" : `${d.inDays} দিন বাকি`}</p>
            </article>
          ))
        )}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/timeline", icon: Sparkle, title: "টাইমলাইন", note: "তারিখ, জায়গা, ছোট্ট গল্প" },
          { href: "/gallery", icon: Images, title: "গ্যালারি", note: "শুধু আমাদের ছবি" },
          { href: "/anniversaries", icon: CalendarHeart, title: "বার্ষিকী", note: "কাউন্টডাউন আর রিমাইন্ডার" },
          { href: "/notes", icon: BookHeart, title: "চিরকুট", note: "চিঠি যেগুলো মুছে যায় না" },
        ].map(({ href, icon: Icon, title, note }) => (
          <Link key={href} href={href} className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
            <Icon className="h-6 w-6 text-primary" />
            <p className="font-display mt-3 text-lg">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{note}</p>
          </Link>
        ))}
      </div>

      {photos.length > 0 ? (
        <>
          <h2 className="font-display mt-12 text-3xl">সাম্প্রতিক ছবি</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {photos.map((p) => (
              <figure key={p.id} className="glass-panel overflow-hidden rounded-2xl">
                <img src={`/api/photos/${p.id}/file`} alt={p.title} className="aspect-[4/5] w-full object-cover" />
                <figcaption className="p-4 text-sm">{p.title}</figcaption>
              </figure>
            ))}
          </div>
        </>
      ) : null}
    </Shell>
  );
}
