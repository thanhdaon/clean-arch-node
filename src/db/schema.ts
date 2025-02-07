import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar({ length: 25 }).primaryKey(),
  role: varchar({ length: 10, enum: ["employee", "employer"] }).notNull(),
});
