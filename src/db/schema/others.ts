import { sql } from "drizzle-orm";
import { datetime, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { user } from "~/db/schema/auth";
import { Id } from "~/domain/id";

export const task = mysqlTable("task", {
  id: varchar({ length: 25 }).primaryKey().$defaultFn(Id.newId),
  title: varchar({ length: 200 }).notNull(),
  status: varchar({ length: 10 }).notNull(),
  createdBy: varchar({ length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  assignedTo: varchar({ length: 36 }).references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: datetime({ mode: "date", fsp: 6 })
    .notNull()
    .default(sql`now(6)`),
  updatedAt: datetime({ mode: "date", fsp: 6 }),
});
