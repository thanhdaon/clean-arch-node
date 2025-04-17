import { defineRelations } from "drizzle-orm";
import * as schema from "~/db/schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    createdTasks: r.many.tasks({ alias: "createdByUser" }),
    assigningTasks: r.many.tasks({ alias: "assignedToUser" }),
  },
  tasks: {
    createdByUser: r.one.users({
      from: r.tasks.createdBy,
      to: r.users.id,
      alias: "createdByUser",
    }),
    assignedToUser: r.one.users({
      from: r.tasks.assignedTo,
      to: r.users.id,
      alias: "assignedToUser",
    }),
  },
}));
