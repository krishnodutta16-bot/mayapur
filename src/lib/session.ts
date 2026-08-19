import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const COOKIE_NAME = "mayapur_session";
const MAX_AGE = 60 * 60 * 24 * 14;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export function allowedEmails(): [string, string] {
  const a = process.env.ALLOWED_EMAIL_1?.trim().toLowerCase();
  const b = process.env.ALLOWED_EMAIL_2?.trim().toLowerCase();
  if (!a || !b || a === b) {
    throw new Error("ALLOWED_EMAIL_1 and ALLOWED_EMAIL_2 must be two different emails.");
  }
  return [a, b];
}

export function isAllowedEmail(email: string) {
  const [a, b] = allowedEmails();
  const n = email.trim().toLowerCase();
  return n === a || n === b;
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
}

export async function readSessionFromToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }
    if (!isAllowedEmail(payload.email)) return null;
    return { id: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return readSessionFromToken(token);
}

export async function sessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return readSessionFromToken(token);
}

export const sessionCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE,
  options: {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
};
