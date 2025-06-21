import { createRoute } from "@hono/zod-openapi";
import type { App } from "~/app";
import { jsonContent } from "~/ports/http/openapi-json";
import {
  createDataSchema,
  ErrorSchema,
  UserSchema,
} from "~/ports/http/openapi-schema";
import { responseOk } from "~/ports/http/response";
import { BAD_REQUEST, OK } from "~/ports/http/status-codes";
import type { AppRouteHandler } from "~/ports/http/types";
import { authMiddleware } from "~/ports/http/middlewares";

export const route = createRoute({
  middleware: [authMiddleware],
  tags: ["users"],
  method: "get",
  path: "/users",
  responses: {
    [OK]: jsonContent(createDataSchema(UserSchema.array())),
    [BAD_REQUEST]: jsonContent(ErrorSchema),
  },
});

export function makeHandler(app: App): AppRouteHandler<typeof route> {
  return async (c) => {
    const users = await app.query.allUsers();
    return responseOk(c, users);
  };
}
