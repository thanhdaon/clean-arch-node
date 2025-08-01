import { SpanKind, context, propagation, trace } from "@opentelemetry/api";
import {
  ATTR_CLIENT_ADDRESS,
  ATTR_HTTP_REQUEST_METHOD,
  ATTR_HTTP_ROUTE,
  ATTR_USER_AGENT_ORIGINAL,
} from "@opentelemetry/semantic-conventions";
import type { MiddlewareHandler } from "hono";
import { pinoLogger } from "hono-pino";
import { auth } from "~/common/auth";
import { UNAUTHORIZED } from "~/ports/http/status-codes";
import { HttpStatusPhrases } from "~/ports/http/status-phrases";

export const instrumentation: MiddlewareHandler = async (c, next) => {
  const tracer = trace.getTracer("");

  const headers = Object.fromEntries(new Headers(c.req.raw.headers));
  const extractedContext = propagation.extract(context.active(), headers);

  const span = tracer.startSpan(`${c.req.method} ${c.req.path}`, {
    kind: SpanKind.SERVER,
    attributes: {
      [ATTR_HTTP_REQUEST_METHOD]: c.req.method,
      [ATTR_HTTP_ROUTE]: c.req.path,
      [ATTR_USER_AGENT_ORIGINAL]: c.req.header("user-agent") || "unknown",
      [ATTR_CLIENT_ADDRESS]:
        c.req.header("x-forwarded-for") ||
        c.req.header("cf-connecting-ip") ||
        c.req.header("x-real-ip") ||
        "unknown",
    },
  });
  c.set("trace-id", span.spanContext().traceId);

  await context.with(trace.setSpan(extractedContext, span), async () => {
    await next();
  });
  span.end();
};

export const logger: MiddlewareHandler = pinoLogger({
  pino: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  },
  http: {
    reqId: false,
    onReqBindings: (c) => ({
      req: {
        url: c.req.path,
        method: c.req.method,
      },
    }),
    onResBindings: (c) => ({
      res: {
        status: c.res.status,
        traceId: c.get("trace-id"),
      },
    }),
  },
});

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session == null) {
    return c.json({ error: HttpStatusPhrases.UNAUTHORIZED }, UNAUTHORIZED);
  }
  c.set("session", session);
  c.set("user", session.user);
  await next();
};