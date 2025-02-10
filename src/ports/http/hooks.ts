import type { Hook } from "@hono/zod-openapi";
import { type ErrorHandler, type NotFoundHandler } from "hono";
import { BAD_REQUEST, NOT_FOUND } from "~/ports/http/status-codes";
import { HttpStatusPhrases } from "~/ports/http/status-phrases";
import { responseInternalError } from "~/ports/http/response";

export const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      error: `${HttpStatusPhrases.NOT_FOUND} - ${c.req.path}`,
    },
    NOT_FOUND
  );
};

export const onError: ErrorHandler = (err, c) => {
  return responseInternalError(c, err);
};

export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        error: result.error.issues
          .map(({ path, message }) => {
            return `Field ${path.join(".")} is invalid. ${message}`;
          })
          .join(", "),
        code: BAD_REQUEST,
      },
      BAD_REQUEST
    );
  }
};
