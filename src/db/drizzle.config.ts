import { defineConfig } from "drizzle-kit";
import { env } from "~/common/env";

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/drizzle",
  dialect: "mysql",
  dbCredentials: { url: env.DB_URL },
});
