import { context, trace, type Attributes } from "@opentelemetry/api";

const tracer = trace.getTracer("");

export function withTrace<T extends (...args: any[]) => any>(
  fn: T,
  name: string,
  attrs?: Attributes
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const span = tracer.startSpan(name, undefined, context.active());

    if (attrs) {
      span.setAttributes(attrs);
    }

    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result
          .then((res) => {
            span.end();
            return res;
          })
          .catch((err) => {
            span.recordException(err);
            span.end();
            throw err;
          }) as ReturnType<T>;
      }
      span.end();
      return result;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  };
}
