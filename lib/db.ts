import "server-only";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const globalForDb = globalThis as unknown as { nursingPool?: Pool };
export const pool = globalForDb.nursingPool ?? new Pool({ connectionString, max: 5, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000 });

if (process.env.NODE_ENV !== "production") globalForDb.nursingPool = pool;
if (process.env.VERCEL) attachDatabasePool(pool);

export async function query(text: string, values: unknown[] = []) {
  const result = await pool.query(text, values);
  return result.rows as Record<string, unknown>[];
}
