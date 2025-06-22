import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { type AnyRouter } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod";
import { Hono } from "hono";

export function attachOpenAPIHandler(app: Hono, router: AnyRouter) {
  const handler = new OpenAPIHandler(router, {
    plugins: [
      new CORSPlugin(),
      new ZodSmartCoercionPlugin(),
      new ZodToJsonSchemaConverter(),
    ],
  });

  app.use('/api/*', async (c, next) => {
    const { matched, response } = await handler.handle(c.req.raw, {
      prefix: '/api',
    })
  
    if (matched) {
      return c.newResponse(response.body, response)
    }
  
    await next()
  })
}