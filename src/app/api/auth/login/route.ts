import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSessionToken, isAllowedEmail, sessionCookie } from "@/lib/session";
import { tooManyAttempts } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(8).max(100),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooManyAttempts(`login:${ip}`)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  if (!isAllowedEmail(email)) {
    return NextResponse.json({ error: "This garden is only for the two of you." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "This garden is only for the two of you." }, { status: 403 });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Those credentials do not open the gate." }, { status: 401 });
  }

  const token = await createSessionToken({ id: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set(sessionCookie.name, token, {
    ...sessionCookie.options,
    maxAge: sessionCookie.maxAge,
  });
  return res;
}
