import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "~/db/db";
import { instrumentation, logger } from "~/ports/http/middlewares";

export function startHttpServer() {
  const app = new Hono();

  app.use(instrumentation);
  app.use(logger);

  app.get("/", async (c) => {
    const records = await db.query.videos.findMany();
    return c.json(records);
  });

  serve({ fetch: app.fetch, port: 8001 }, (info) => {
    console.log(`*** Server started on port ${info.port} ***`);
  });
}
