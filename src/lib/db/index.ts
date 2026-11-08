import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL_POOLED or DATABASE_URL must be configured.");

const globalForDb = globalThis as unknown as { pgPool?: Pool };
const pool = globalForDb.pgPool ?? new Pool({
  connectionString,
  max: Number(process.env.DB_POOL_MAX ?? 5),
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
  ssl: { rejectUnauthorized: true }
});

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;

export const db = drizzle(pool, { schema });
