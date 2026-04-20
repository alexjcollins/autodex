import { isWorkosConfigured, getAuthorizationUrl } from '@/lib/auth/workos';

export async function GET(request: Request) {
  if (!isWorkosConfigured) {
    return Response.json(
      { error: 'WorkOS is not configured. Set WORKOS_API_KEY and WORKOS_CLIENT_ID.' },
      { status: 501 },
    );
  }
  const url = new URL(request.url);
  const state = url.searchParams.get('state') ?? crypto.randomUUID();
  const authorizationUrl = getAuthorizationUrl(state);
  return Response.json({ url: authorizationUrl, state });
}
