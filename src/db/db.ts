import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/common/env";
import * as schema from "~/db/schema";

export const db = drizzle({
  mode: "default",
  client: mysql.createPool({ uri: env.DB_URL }),
  schema,
});

export type DB = typeof db;
