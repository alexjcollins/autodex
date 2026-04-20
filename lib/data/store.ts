// Server-side in-memory store used when DATABASE_URL is absent.
// State lives for the lifetime of the dev server — good enough to demo the flow.

import { FALLBACK_CARS } from './fallback';

type UserKey = string;

type Entry = {
  carId: string;
  acquiredAt?: string;
  targetPriceUsd?: number;
  priority?: number;
  notes?: string;
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __autodex_memstore__:
    | {
        garage: Map<UserKey, Entry[]>;
        wishlist: Map<UserKey, Entry[]>;
      }
    | undefined;
}

function store() {
  if (!globalThis.__autodex_memstore__) {
    globalThis.__autodex_memstore__ = {
      garage: new Map(),
      wishlist: new Map(),
    };
  }
  return globalThis.__autodex_memstore__;
}

export function listCars() {
  return FALLBACK_CARS;
}

export function getCar(id: string) {
  return FALLBACK_CARS.find((c) => c.id === id || c.slug === id) ?? null;
}

export function listGarage(userId: UserKey) {
  const entries = store().garage.get(userId) ?? [];
  return entries
    .map((e) => ({
      ...e,
      car: getCar(e.carId),
    }))
    .filter((e) => e.car !== null);
}

export function addToGarage(userId: UserKey, carId: string, notes?: string) {
  const list = store().garage.get(userId) ?? [];
  if (list.some((e) => e.carId === carId)) return list;
  const next: Entry = { carId, notes, createdAt: new Date().toISOString() };
  const updated = [next, ...list];
  store().garage.set(userId, updated);
  return updated;
}

export function removeFromGarage(userId: UserKey, carId: string) {
  const list = store().garage.get(userId) ?? [];
  store().garage.set(
    userId,
    list.filter((e) => e.carId !== carId),
  );
}

export function listWishlist(userId: UserKey) {
  const entries = store().wishlist.get(userId) ?? [];
  return entries
    .map((e) => ({ ...e, car: getCar(e.carId) }))
    .filter((e) => e.car !== null);
}

export function addToWishlist(
  userId: UserKey,
  carId: string,
  opts: { targetPriceUsd?: number; priority?: number; notes?: string } = {},
) {
  const list = store().wishlist.get(userId) ?? [];
  if (list.some((e) => e.carId === carId)) return list;
  const next: Entry = {
    carId,
    ...opts,
    createdAt: new Date().toISOString(),
  };
  const updated = [next, ...list];
  store().wishlist.set(userId, updated);
  return updated;
}

export function removeFromWishlist(userId: UserKey, carId: string) {
  const list = store().wishlist.get(userId) ?? [];
  store().wishlist.set(
    userId,
    list.filter((e) => e.carId !== carId),
  );
}
