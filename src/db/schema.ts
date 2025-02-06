import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const videos = mysqlTable("videos", {
  id: int("id", { unsigned: true }).primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
});
