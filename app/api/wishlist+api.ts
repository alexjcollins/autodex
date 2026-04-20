import { getSession } from '@/lib/auth/session';
import {
  addToWishlist,
  listWishlist,
  removeFromWishlist,
} from '@/lib/data/store';

function resolveUserId(request: Request, session: Awaited<ReturnType<typeof getSession>>) {
  if (session) return session.userId;
  return request.headers.get('x-autodex-guest') ?? 'guest';
}

export async function GET(request: Request) {
  const session = await getSession(request);
  const userId = resolveUserId(request, session);
  return Response.json({ entries: listWishlist(userId) });
}

export async function POST(request: Request) {
  const session = await getSession(request);
  const userId = resolveUserId(request, session);
  const body = (await request.json().catch(() => null)) as
    | {
        carId?: string;
        targetPriceUsd?: number;
        priority?: number;
        notes?: string;
      }
    | null;
  if (!body?.carId) {
    return Response.json({ error: 'carId required' }, { status: 400 });
  }
  addToWishlist(userId, body.carId, {
    targetPriceUsd: body.targetPriceUsd,
    priority: body.priority,
    notes: body.notes,
  });
  return Response.json({ entries: listWishlist(userId) });
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
  removeFromWishlist(userId, body.carId);
  return Response.json({ entries: listWishlist(userId) });
}
