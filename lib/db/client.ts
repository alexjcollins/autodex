import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __autodex_pg__: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(connectionString);

function makeClient() {
  if (!connectionString) {
    return null;
  }
  if (!globalThis.__autodex_pg__) {
    globalThis.__autodex_pg__ = postgres(connectionString, {
      prepare: false,
      max: 5,
    });
  }
  return globalThis.__autodex_pg__;
}

const sql = makeClient();

export const db = sql ? drizzle(sql, { schema }) : null;
export { schema };
