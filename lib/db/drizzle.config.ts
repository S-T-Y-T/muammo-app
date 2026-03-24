import { defineConfig } from "drizzle-kit";
import path from "path";

const dbPath = process.env.DATABASE_URL || path.resolve(process.cwd(), "../data/sqlite.db");

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
