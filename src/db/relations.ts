import { defineRelations } from "drizzle-orm";
import * as otherSchema from "~/db/schema/others";
import * as authschema from "~/db/schema/auth";

const schema = { ...otherSchema, ...authschema };

export const relations = defineRelations(schema, (r) => ({
  user: {
    createdTasks: r.many.task({ alias: "createdByUser" }),
    assigningTasks: r.many.task({ alias: "assignedToUser" }),
  },
  task: {
    createdByUser: r.one.user({
      from: r.task.createdBy,
      to: r.user.id,
      alias: "createdByUser",
    }),
    assignedToUser: r.one.user({
      from: r.task.assignedTo,
      to: r.user.id,
      alias: "assignedToUser",
    }),
  },
}));
