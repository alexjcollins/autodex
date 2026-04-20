import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '@/lib/api-client';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  guest?: boolean;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const GUEST_KEY = 'autodex.guest';

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const me = await apiFetch<{ user: AuthUser | null }>('/api/me');
      if (me.user) {
        setUser(me.user);
        setLoading(false);
        return;
      }
    } catch {
      // fall through to guest
    }
    try {
      const stored = await SecureStore.getItemAsync(GUEST_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }

  async function signInAsGuest() {
    const guest: AuthUser = {
      id: 'guest',
      email: 'guest@autodex.app',
      name: 'Guest Driver',
      avatarUrl: null,
      guest: true,
    };
    await SecureStore.setItemAsync(GUEST_KEY, JSON.stringify(guest));
    setUser(guest);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(GUEST_KEY).catch(() => undefined);
    try {
      await apiFetch('/api/auth/sign-out', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, signInAsGuest, signOut, refresh }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
