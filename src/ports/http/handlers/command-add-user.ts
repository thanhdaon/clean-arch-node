import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import type { App } from "~/app";
import { jsonContent, jsonContentRequired } from "~/ports/http/openapi-json";
import { ErrorSchema, MessageSchema } from "~/ports/http/openapi-schema";
import { responseOkMessage } from "~/ports/http/response";
import { BAD_REQUEST, OK } from "~/ports/http/status-codes";
import type { AppRouteHandler } from "~/ports/http/types";

const BodySchema = z.object({
  role: z.enum(["employee", "employer"]),
});

export const route = createRoute({
  tags: ["users"],
  method: "post",
  path: "/users",
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
    await app.command.addUser({ role: body.role });
    return responseOkMessage(c, "a new user added");
  };
}
