import { context as otelContext, SpanKind, trace } from "@opentelemetry/api";
import { ORPCError, os } from "@orpc/server";
import { log } from "~/common/logger";
import { BadRequestError, NotFoundError } from "~/domain/error";

export const instrumentation = os.middleware(
  async ({ context, next, path }) => {
    const tracer = trace.getTracer("");
    const extractedContext = otelContext.active();
    const spanName = path.join(".");
    const span = tracer.startSpan(spanName, {
      kind: SpanKind.SERVER,
      attributes: {
        "rpc.method": path[path.length - 1],
      },
    });

    const traceId = span.spanContext().traceId;

    try {
      const result = await otelContext.with(
        trace.setSpan(extractedContext, span),
        async () => {
          return await next({ context: { ...context, traceId } });
        }
      );

      span.setStatus({ code: 1 });

      return result;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      span.recordException(err);
      span.setStatus({ code: 2, message: err.message });
      throw error;
    } finally {
      span.end();
    }
  }
);

export const logger = os.middleware(({ context, next, path }, input) => {
  log.info({ path, context, input }, "new request");
  return next();
});

export const errorHandler = os.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      throw new ORPCError("BAD_REQUEST", { message: error.message });
    }
  
    if (error instanceof NotFoundError) {
      throw new ORPCError("NOT_FOUND", { message: error.message });
    }

    throw new ORPCError("UNKNOWN_ERROR", { message: String(error) });
  }
});
