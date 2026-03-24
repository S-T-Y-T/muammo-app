import { defineConfig } from "drizzle-kit";

const dbPath = process.env.DATABASE_URL || "sqlite.db";

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
