import { getSession } from '@/lib/auth/session';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ user: null });
  }
  return Response.json({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      avatarUrl: session.avatarUrl,
    },
  });
}
