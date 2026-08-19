"use client";

import { useMemo } from "react";

function seeded(count: number, seed: number) {
  const items = [];
  let x = seed;
  for (let i = 0; i < count; i++) {
    x = (x * 9301 + 49297) % 233280;
    const a = x / 233280;
    x = (x * 9301 + 49297) % 233280;
    const b = x / 233280;
    x = (x * 9301 + 49297) % 233280;
    const c = x / 233280;
    items.push({ a, b, c });
  }
  return items;
}

export function NightSky() {
  const stars = useMemo(() => seeded(70, 7), []);
  const fireflies = useMemo(() => seeded(16, 31), []);
  const petals = useMemo(() => seeded(12, 53), []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="animate-drift absolute right-[8%] top-[6%]">
        <div className="h-28 w-28 rounded-full bg-moon shadow-[var(--shadow-moon)] sm:h-40 sm:w-40" />
      </div>
      {stars.map((s, i) => (
        <span
          key={`s-${i}`}
          className="animate-twinkle absolute rounded-full bg-star"
          style={{
            left: `${s.a * 100}%`,
            top: `${s.b * 70}%`,
            width: `${1 + s.c * 2.5}px`,
            height: `${1 + s.c * 2.5}px`,
            animationDelay: `${s.c * 5}s`,
          }}
        />
      ))}
      {fireflies.map((f, i) => (
        <span
          key={`f-${i}`}
          className="animate-firefly absolute h-1.5 w-1.5 rounded-full bg-firefly"
          style={{
            left: `${f.a * 100}%`,
            bottom: "-5%",
            animationDelay: `${f.b * 14}s`,
            animationDuration: `${11 + f.c * 8}s`,
            boxShadow: "0 0 12px 3px var(--firefly)",
          }}
        />
      ))}
      {petals.map((p, i) => (
        <span
          key={`p-${i}`}
          className="animate-petal absolute bg-primary/70"
          style={{
            left: `${p.a * 100}%`,
            top: "-8%",
            width: `${6 + p.c * 6}px`,
            height: `${6 + p.c * 4}px`,
            borderRadius: "60% 10% 60% 10%",
            animationDelay: `${p.b * 16}s`,
            animationDuration: `${13 + p.c * 9}s`,
          }}
        />
      ))}
    </div>
  );
}
