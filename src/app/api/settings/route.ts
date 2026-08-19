import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { daysTogether } from "@/lib/dates";

const schema = z.object({
  togetherSince: z.string().min(8).optional(),
  homeQuote: z.string().max(300).optional(),
});

export async function GET() {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const setting = await prisma.setting.findUnique({ where: { id: "couple" } });
  if (!setting) {
    return NextResponse.json({ togetherSince: null, homeQuote: "", days: 0 });
  }
  return NextResponse.json({
    togetherSince: setting.togetherSince.toISOString(),
    homeQuote: setting.homeQuote,
    days: daysTogether(setting.togetherSince),
  });
}

export async function PUT(request: Request) {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
  }
  const current = await prisma.setting.findUnique({ where: { id: "couple" } });
  const togetherSince = parsed.data.togetherSince
    ? new Date(parsed.data.togetherSince)
    : current?.togetherSince ?? new Date();
  const homeQuote = parsed.data.homeQuote?.trim() ?? current?.homeQuote ?? "";
  const setting = await prisma.setting.upsert({
    where: { id: "couple" },
    update: { togetherSince, homeQuote },
    create: { id: "couple", togetherSince, homeQuote },
  });
  return NextResponse.json({
    togetherSince: setting.togetherSince.toISOString(),
    homeQuote: setting.homeQuote,
    days: daysTogether(setting.togetherSince),
  });
}
