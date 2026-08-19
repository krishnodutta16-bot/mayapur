import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(4000),
  place: z.string().max(120).optional().default(""),
  happenedAt: z.string().min(8),
});

export async function GET() {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.memory.findMany({
    orderBy: { happenedAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill title, story, and date." }, { status: 400 });
  }
  const item = await prisma.memory.create({
    data: {
      title: parsed.data.title.trim(),
      body: parsed.data.body.trim(),
      place: parsed.data.place.trim(),
      happenedAt: new Date(parsed.data.happenedAt),
      createdById: user.id,
    },
    include: { createdBy: { select: { name: true } } },
  });
  return NextResponse.json(item);
}
