import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLED;
if (!connectionString) throw new Error("DATABASE_URL (direct) or DATABASE_URL_POOLED is required.");

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: connectionString },
  strict: true,
  verbose: true
});
