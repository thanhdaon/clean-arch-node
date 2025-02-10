import type { Context } from "hono";
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "~/ports/http/status-codes";
import { HttpStatusPhrases } from "~/ports/http/status-phrases";

export function responseBadRequest(c: Context, error: string) {
  return c.json({ traceId: c.get("trace-id"), error }, BAD_REQUEST);
}

export function responseCreated<T>(c: Context, data: T) {
  return c.json({ code: CREATED, data, traceId: c.get("trace-id") }, CREATED);
}

export function responseOk<T>(c: Context, data: T) {
  return c.json({ data, traceId: c.get("trace-id") }, OK);
}

export function responseOkMessage(c: Context, message: string) {
  return c.json({ message, traceId: c.get("trace-id") }, OK);
}

export function responseNotFound(c: Context, error: string) {
  return c.json({ traceId: c.get("trace-id"), error }, NOT_FOUND);
}

export function responseUnthenticated(c: Context) {
  return c.json(
    { traceId: c.get("trace-id"), error: HttpStatusPhrases.UNAUTHORIZED },
    UNAUTHORIZED
  );
}

export function responseForbidden(c: Context) {
  return c.json(
    { traceId: c.get("trace-id"), error: HttpStatusPhrases.FORBIDDEN },
    FORBIDDEN
  );
}

export function responseInternalError(c: Context, err: Error) {
  return c.json(
    {
      error: err.message,
      traceId: c.get("trace-id"),
    },
    INTERNAL_SERVER_ERROR
  );
}
