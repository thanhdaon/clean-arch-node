import { context as otelContext, SpanKind, trace } from "@opentelemetry/api";
import { os } from "@orpc/server";
import { log } from "~/common/logger";

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
