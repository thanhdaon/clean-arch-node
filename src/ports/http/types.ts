import {
  OpenAPIHono,
  type RouteConfig,
  type RouteHandler,
  z,
} from "@hono/zod-openapi";

export interface AppBindings {
  Variables: {};
}

export type App = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type ZodSchema = z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
