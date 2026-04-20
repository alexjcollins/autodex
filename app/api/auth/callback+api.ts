import { workos, workosClientId, isWorkosConfigured } from '@/lib/auth/workos';
import { sessionCookie, signSession } from '@/lib/auth/session';

export async function GET(request: Request) {
  if (!isWorkosConfigured || !workos) {
    return Response.json({ error: 'WorkOS is not configured' }, { status: 501 });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return Response.json({ error: 'Missing code' }, { status: 400 });
  }

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId: workosClientId,
  });

  const token = await signSession({
    userId: user.id,
    workosId: user.id,
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
    avatarUrl: user.profilePictureUrl ?? null,
  });

  if (!token) {
    return Response.json({ error: 'Missing SESSION_SECRET' }, { status: 500 });
  }

  const headers = new Headers();
  headers.set('Set-Cookie', sessionCookie(token));
  headers.set('Location', '/');
  return new Response(null, { status: 302, headers });
}
