import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(8000),
});

export async function GET() {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Write a title and a letter." }, { status: 400 });
  }
  const item = await prisma.note.create({
    data: {
      title: parsed.data.title.trim(),
      body: parsed.data.body.trim(),
      createdById: user.id,
    },
    include: { createdBy: { select: { name: true } } },
  });
  return NextResponse.json(item);
}
