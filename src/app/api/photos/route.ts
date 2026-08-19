import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX = 8 * 1024 * 1024;

export async function GET() {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.photo.findMany({
    orderBy: { happenedAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const title = String(form.get("title") || "").trim();
  const caption = String(form.get("caption") || "").trim();
  const place = String(form.get("place") || "").trim();
  const happenedAt = String(form.get("happenedAt") || "");

  if (!(file instanceof File) || !title || !happenedAt) {
    return NextResponse.json({ error: "Photo, title, and date are required." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type) || file.size > MAX) {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP or GIF under 8MB." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  const item = await prisma.photo.create({
    data: {
      title,
      caption,
      place,
      filename,
      mimeType: file.type,
      happenedAt: new Date(happenedAt),
      createdById: user.id,
    },
    include: { createdBy: { select: { name: true } } },
  });
  return NextResponse.json(item);
}
