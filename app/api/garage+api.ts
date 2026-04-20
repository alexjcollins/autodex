import { getSession } from '@/lib/auth/session';
import {
  addToGarage,
  listGarage,
  removeFromGarage,
} from '@/lib/data/store';

function resolveUserId(request: Request, session: Awaited<ReturnType<typeof getSession>>) {
  if (session) return session.userId;
  // Fallback: allow guest session from header for demo mode.
  return request.headers.get('x-autodex-guest') ?? 'guest';
}

export async function GET(request: Request) {
  const session = await getSession(request);
  const userId = resolveUserId(request, session);
  return Response.json({ entries: listGarage(userId) });
}

export async function POST(request: Request) {
  const session = await getSession(request);
  const userId = resolveUserId(request, session);
  const body = (await request.json().catch(() => null)) as
    | { carId?: string; notes?: string }
    | null;
  if (!body?.carId) {
    return Response.json({ error: 'carId required' }, { status: 400 });
  }
  addToGarage(userId, body.carId, body.notes);
  return Response.json({ entries: listGarage(userId) });
}

export async function DELETE(request: Request) {
  const session = await getSession(request);
  const userId = resolveUserId(request, session);
  const body = (await request.json().catch(() => null)) as
    | { carId?: string }
    | null;
  if (!body?.carId) {
    return Response.json({ error: 'carId required' }, { status: 400 });
  }
  removeFromGarage(userId, body.carId);
  return Response.json({ entries: listGarage(userId) });
}
