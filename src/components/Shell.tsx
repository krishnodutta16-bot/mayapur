"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookHeart, CalendarHeart, Home, Images, LogOut, Sparkle } from "lucide-react";
import { MusicToggle } from "./MusicToggle";

const links = [
  { href: "/", label: "ঘর", icon: Home },
  { href: "/timeline", label: "টাইমলাইন", icon: Sparkle },
  { href: "/gallery", label: "গ্যালারি", icon: Images },
  { href: "/anniversaries", label: "বার্ষিকী", icon: CalendarHeart },
  { href: "/notes", label: "চিরকুট", icon: BookHeart },
];

export function Shell({ name, children }: { name: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-30 px-4 pt-4">
        <div className="glass-panel mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-full px-4 py-2">
          <Link href="/" className="font-display text-lg text-dream">
            মায়াপুর
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
                    active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{name}</span>
            <MusicToggle />
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-8">{children}</div>
    </div>
  );
}
