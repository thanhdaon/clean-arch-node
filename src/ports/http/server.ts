import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import type { App } from "~/app";
import { auth } from "~/common/auth";
import { defaultHook, notFound, onError } from "~/ports/http/hooks";
import { instrumentation, logger } from "~/ports/http/middlewares";
import type { AppBindings } from "~/ports/http/types";

import * as commandAddUser from "~/ports/http/handlers/command-add-user";
import * as commandAssignTask from "~/ports/http/handlers/command-assign-task";
import * as commandCreateTask from "~/ports/http/handlers/command-create-task";
import * as queryAllUsers from "~/ports/http/handlers/query-all-users";

export function runHttpServer(app: App) {
  const hono = new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });

  const router = hono.basePath("/api");

  router.use(instrumentation);
  router.use(cors());
  router.use(logger);
  router.notFound(notFound);
  router.onError(onError);

  router.doc("/openapi-json", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Doc",
    },
  });
  router.get("/doc", swaggerUI({ url: "/api/openapi-json" }));

  router.openapi(commandAddUser.route, commandAddUser.makeHandler(app));
  router.openapi(commandCreateTask.route, commandCreateTask.makeHandler(app));
  router.openapi(commandAssignTask.route, commandAssignTask.makeHandler(app));
  router.openapi(queryAllUsers.route, queryAllUsers.makeHandler(app));

  serve({ fetch: router.fetch, port: 8001 }, (info) => {
    console.log(`*** Server's running on port ${info.port} ***`);
  });
}
