import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

// Initialize SQLite database in the data folder
const dbPath = process.env.DATABASE_URL || path.resolve(process.cwd(), "../data/sqlite.db");
const client = createClient({ url: `file:${dbPath}` });

export const db = drizzle(client, { schema });

export * from "./schema";
