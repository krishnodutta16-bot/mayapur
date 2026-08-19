import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1).max(120),
  kind: z.enum(["anniversary", "birthday", "first_meet", "other"]),
  date: z.string().min(8),
  note: z.string().max(500).optional().default(""),
});

export async function GET() {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.anniversary.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please add a title, type, and date." }, { status: 400 });
  }
  const item = await prisma.anniversary.create({
    data: {
      title: parsed.data.title.trim(),
      kind: parsed.data.kind,
      date: new Date(parsed.data.date),
      note: parsed.data.note.trim(),
    },
  });
  return NextResponse.json(item);
}
