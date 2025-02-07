import { z } from "@hono/zod-openapi";

export function createDataSchema<T>(schema: z.ZodType<T>) {
  return z.object({
    data: schema,
    traceId: z.string().openapi({ example: "some trace id" }),
  });
}

export function createPaginationSchema<T>(schema: z.ZodType<T>) {
  return z.object({
    data: schema.array(),
    total: z.number().gte(0),
    page: z.number().gt(0),
    pageSize: z.number().gt(0),
  });
}

export const UserSchema = z
  .object({
    uuid: z.string(),
    role: z.string(),
  })
  .openapi("User");

export const TaskSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    status: z.enum(["todo", "in-progress", "done", "pending"]),
    createdAt: z.date(),
    dueDate: z.date(),
  })
  .openapi("Task");

export const ErrorSchema = z
  .object({
    code: z.number().openapi({ example: 400 }),
    error: z.string().openapi({ example: "error" }),
  })
  .openapi("Error");

export const MessageSchema = z
  .object({
    message: z.string().openapi({ example: "some message" }),
    traceId: z.string().openapi({ example: "some trace id" }),
  })
  .openapi("Message");
