import { clearSessionCookie } from '@/lib/auth/session';

export async function POST() {
  const headers = new Headers();
  headers.set('Set-Cookie', clearSessionCookie());
  return new Response(null, { status: 204, headers });
}
