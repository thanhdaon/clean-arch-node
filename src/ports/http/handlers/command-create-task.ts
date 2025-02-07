import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import type { App } from "~/app";
import { jsonContent, jsonContentRequired } from "~/ports/http/openapi-json";
import { ErrorSchema, MessageSchema } from "~/ports/http/openapi-schema";
import { BAD_REQUEST, OK } from "~/ports/http/status-codes";
import type { AppRouteHandler } from "~/ports/http/types";
import { responseOkMessage } from "~/ports/http/response";

const BodySchema = z.object({
  title: z.string(),
  createdBy: z.string(),
});

export const route = createRoute({
  tags: ["tasks"],
  method: "post",
  path: "/tasks",
  request: {
    body: jsonContentRequired(BodySchema),
  },
  responses: {
    [OK]: jsonContent(MessageSchema),
    [BAD_REQUEST]: jsonContent(ErrorSchema),
  },
});

export function makeHandler(app: App): AppRouteHandler<typeof route> {
  return async (c) => {
    const body = c.req.valid("json");
    await app.command.createTask({
      title: body.title,
      createdBy: body.createdBy,
    });
    return responseOkMessage(c, "a new task created");
  };
}
