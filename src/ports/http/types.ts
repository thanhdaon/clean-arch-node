import {
  OpenAPIHono,
  type RouteConfig,
  type RouteHandler,
  z,
} from "@hono/zod-openapi";
import type { Session, User } from "better-auth";
import type { Context } from "hono";

export interface AppBindings {
  Variables: {
    traceId: string;
  };
}

export interface AppAuthedBindings {
  Variables: {
    traceId: string;
    session: Session;
    user: User;
  };
}

export type AppContext = Context<AppBindings>;

export type App = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type AppAuthedRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppAuthedBindings
>;

export type ZodSchema = z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
