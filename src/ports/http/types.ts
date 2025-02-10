import {
  OpenAPIHono,
  type RouteConfig,
  type RouteHandler,
  z,
} from "@hono/zod-openapi";
import type { Context } from "hono";
import type { JwtVariables } from "hono/jwt";

export interface AppBindings {
  Variables: JwtVariables;
}

export type AppContext = Context<AppBindings>;

export type App = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type ZodSchema = z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
