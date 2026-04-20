import Constants from 'expo-constants';

const envBase =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  '';

function resolveBase() {
  if (envBase) return envBase.replace(/\/$/, '');
  // On native dev we expect Expo Router API routes to be served from the same dev server.
  // expo-constants exposes the host URI (e.g. exp://192.168.0.10:8081).
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const [host] = hostUri.split(':');
    const port = hostUri.split(':')[1] ?? '8081';
    return `http://${host}:${port}`;
  }
  return '';
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const base = resolveBase();
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  const body = text ? safeJson(text) : null;
  if (!res.ok) {
    const msg =
      (body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : res.statusText) || 'Request failed';
    throw new ApiError(msg, res.status);
  }
  return body as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
