import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

// Initialize SQLite database at the root of the workspace or in api-server
const dbPath = process.env.DATABASE_URL || path.resolve(process.cwd(), "sqlite.db");
const client = createClient({ url: `file:${dbPath}` });

export const db = drizzle(client, { schema });

export * from "./schema";
