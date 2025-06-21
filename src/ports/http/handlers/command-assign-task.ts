import { createRoute, z } from "@hono/zod-openapi";
import type { App } from "~/app";
import { auth } from "~/common/auth";
import { getUserFromCtx } from "~/ports/http/auth";
import { jsonContent } from "~/ports/http/openapi-json";
import { ErrorSchema, MessageSchema } from "~/ports/http/openapi-schema";
import { responseForbidden, responseOkMessage } from "~/ports/http/response";
import { BAD_REQUEST, FORBIDDEN, OK } from "~/ports/http/status-codes";
import type { AppRouteHandler } from "~/ports/http/types";

const PathParamsSchema = z.object({
  taskId: z.string().openapi({
    param: {
      name: "taskId",
      in: "path",
    },
    required: ["taskId"],
    example: "cbhew0aay5zlrygg5wfgcv5c",
  }),
  assigneeId: z.string().openapi({
    param: {
      name: "assigneeId",
      in: "path",
    },
    required: ["assigneeId"],
    example: "cbhew0aay5zlry43awfgcv5c",
  }),
});

export const route = createRoute({
  tags: ["tasks"],
  method: "put",
  path: "/tasks/{taskId}/users/{assigneeId}",
  request: {
    params: PathParamsSchema,
  },
  responses: {
    [OK]: jsonContent(MessageSchema),
    [BAD_REQUEST]: jsonContent(ErrorSchema),
    [FORBIDDEN]: jsonContent(ErrorSchema),
  },
});

export function makeHandler(app: App): AppRouteHandler<typeof route> {
  return async (c) => {
    const assigner = getUserFromCtx(c);
    if (assigner === undefined) {
      return responseForbidden(c);
    }

    const params = c.req.valid("param");

    await app.command.assignTask({
      assigner: assigner,
      taskId: params.taskId,
      assigneeId: params.assigneeId,
    });

    return responseOkMessage(c, "assign task success");
  };
}
