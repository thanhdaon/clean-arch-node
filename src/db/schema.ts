import {  sql } from "drizzle-orm";
import { datetime, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { Id } from "~/domain/id";

export const users = mysqlTable("users", {
  id: varchar({ length: 25 }).primaryKey().$defaultFn(Id.newId),
  role: varchar({ length: 10, enum: ["employee", "employer"] }).notNull(),
});

export const tasks = mysqlTable("tasks", {
  id: varchar({ length: 25 }).primaryKey().$defaultFn(Id.newId),
  title: varchar({ length: 200 }).notNull(),
  status: varchar({ length: 10 }).notNull(),
  createdBy: varchar({ length: 25 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assignedTo: varchar({ length: 25 }).references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: datetime({ mode: "date", fsp: 6 })
    .notNull()
    .default(sql`now(6)`),
  updatedAt: datetime({ mode: "date", fsp: 6 }),
});