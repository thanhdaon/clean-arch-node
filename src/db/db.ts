import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/common/env";
import { relations } from "~/db/relations";

const client = mysql.createPool({ uri: env.DB_URL });

export const db = drizzle(client, { mode: "default", relations });
export type DB = typeof db;
