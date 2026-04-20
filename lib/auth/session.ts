import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE = 'autodex_session';
const SESSION_TTL = '30d';

function getSecret() {
  const raw = process.env.SESSION_SECRET;
  if (!raw) {
    return null;
  }
  return new TextEncoder().encode(raw);
}

export type SessionPayload = {
  userId: string;
  workosId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

export async function signSession(payload: SessionPayload): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string) {
  const maxAge = 60 * 60 * 24 * 30;
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function readSessionCookie(request: Request): string | null {
  const header = request.headers.get('cookie');
  if (!header) return null;
  const match = header.split(';').find((c) => c.trim().startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  return match.split('=')[1]?.trim() ?? null;
}

export async function getSession(request: Request): Promise<SessionPayload | null> {
  const token = readSessionCookie(request);
  if (!token) return null;
  return verifySession(token);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
