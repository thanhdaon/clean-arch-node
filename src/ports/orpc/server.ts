import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "~/common/env";
import { buildRouter } from "~/ports/orpc/router";
import { attachDocsHandler } from "~/ports/orpc/handler-docs";
import { attachOpenAPIHandler } from "~/ports/orpc/handler-openapi";
import type { App } from "~/app";
import { log } from "~/common/logger";

export function startOrpcServer(app: App) {
  const hono = new Hono();
  const orpcRouter = buildRouter(app);

  attachDocsHandler(hono, orpcRouter);
  attachOpenAPIHandler(hono, orpcRouter);

  serve({ fetch: hono.fetch, port: env.PORT }, (info) => {
    log.info(`ORPC server is running on ${info.port}`);
  });
}
