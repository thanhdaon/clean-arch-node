import { z } from "@hono/zod-openapi";

export const idParamsSchema = (paramName: string) => {
  return z.object({
    id: z.coerce.number().openapi({
      param: {
        name: "id",
        in: "path",
      },
      required: ["id"],
      example: 42,
    }),
  });
};
