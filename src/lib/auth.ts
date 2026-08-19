import { prisma } from "./db";
import { getSession, isAllowedEmail, type SessionUser } from "./session";

export {
  COOKIE_NAME,
  allowedEmails,
  isAllowedEmail,
  createSessionToken,
  readSessionFromToken,
  getSession,
  sessionFromRequest,
  sessionCookie,
  type SessionUser,
} from "./session";

export async function requireSession(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !isAllowedEmail(user.email)) return null;
  return { id: user.id, email: user.email, name: user.name };
}
