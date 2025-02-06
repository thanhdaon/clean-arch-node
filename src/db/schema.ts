import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const videos = mysqlTable("videos", {
  id: int("id", { unsigned: true }).primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
});

export const users = mysqlTable("users", {
  id: varchar({ length: 25 }).primaryKey(),
  role: varchar({ length: 10, enum: ["employee", "employer"] }).notNull(),
});
