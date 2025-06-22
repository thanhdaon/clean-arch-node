import { os } from "@orpc/server";
import { z } from "zod";
import type { App } from "~/app";
import { base } from "~/ports/orpc/base";

function buildCreateTask(app: App) {
  const CreateTaskInput = z.object({
    title: z.string().min(1),
    createdBy: z.string().min(1),
  });

  return base
    .route({ method: "POST", path: "/tasks", tags: ["tasks"] })
    .input(CreateTaskInput)
    .handler(async ({ input }) => {
      await app.command.createTask({
        title: input.title,
        createdBy: input.createdBy,
      });
    });
}

export function buildRouter(app: App) {
  return os.router({
    task: {
      create: buildCreateTask(app),
    },
  });
}
