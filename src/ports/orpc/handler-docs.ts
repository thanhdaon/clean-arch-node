import { OpenAPIGenerator } from "@orpc/openapi";
import { type AnyRouter } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { Hono } from "hono";

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

export function attachDocsHandler(app: Hono, router: AnyRouter) {
  app.get("/api/docs.json", async (c) => {
    const spec = await openAPIGenerator.generate(router, {
      info: {
        title: "OpenAPI Playground",
        version: "1.0.0",
      },
      servers: [
        { url: "http://localhost:8001/api", description: "Dev" },
        { url: "https://api.openai.com/v1", description: "Staging" },
        { url: "https://api.openai.com/v1", description: "Production" },
      ],
    });
    return c.json(spec);
  });

  const docsHtml = `
    <!DOCTYPE html>
      <html>
      <head>
        <title>API Docs</title>
        <script src="https://unpkg.com/@stoplight/elements/web-components.min.js" type="module"></script>
        <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
      </head>
      <body style="margin: 0; padding: 0; width: 100vw; height: 100vh;">
        <elements-api
          apiDescriptionUrl="/api/docs.json"
          router="hash"
          layout="sidebar"
        />
      </body>
    </html>
`;

  app.get("/api/docs", (c) => c.html(docsHtml));
}
