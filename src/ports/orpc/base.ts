import { os } from "@orpc/server";
import { errorHandler, instrumentation, logger } from "~/ports/orpc/middlewares";

export const base = os.use(instrumentation).use(logger).use(errorHandler);