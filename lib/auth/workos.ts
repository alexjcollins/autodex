import { WorkOS } from '@workos-inc/node';

const apiKey = process.env.WORKOS_API_KEY;
const clientId = process.env.WORKOS_CLIENT_ID;

export const isWorkosConfigured = Boolean(apiKey && clientId);

export const workos = apiKey ? new WorkOS(apiKey) : null;

export const workosClientId = clientId ?? '';

export const workosRedirectUri =
  process.env.WORKOS_REDIRECT_URI ?? 'autodex://auth/callback';

export function getAuthorizationUrl(state: string) {
  if (!workos || !clientId) {
    throw new Error('WorkOS is not configured');
  }
  return workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    clientId,
    redirectUri: workosRedirectUri,
    state,
  });
}
