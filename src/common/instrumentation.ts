import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { MySQL2Instrumentation } from "@opentelemetry/instrumentation-mysql2";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { env } from "~/common/env";

const otlpExporter = new OTLPTraceExporter({
  url: env.OTLP_TRACE_EXPORTER_URL,
});

const resource = new Resource({
  [ATTR_SERVICE_NAME]: "videos",
  [ATTR_SERVICE_VERSION]: "0.0.1",
});

const sdk = new NodeSDK({
  resource,
  traceExporter: otlpExporter,
  instrumentations: [new MySQL2Instrumentation(), new HttpInstrumentation()],
});

sdk.start();

console.log("*** Instrumentation started ***");
