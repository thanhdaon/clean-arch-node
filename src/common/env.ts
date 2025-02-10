import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SERVICE_NAME: z.string(),
    DB_URL: z.string().url(),
    OTLP_TRACE_EXPORTER_URL: z.string().url(),
    JWT_SECRET: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
