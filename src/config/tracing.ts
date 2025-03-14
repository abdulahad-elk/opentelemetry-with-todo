import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';

// Configure the SDK with GCP Trace Exporter
export async function createOpenTelemetrySDK() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'nestjs-todo-app',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    }),
    traceExporter: new TraceExporter(),
    instrumentations: [
      getNodeAutoInstrumentations({
        // Add specific instrumentation configuration here
        '@opentelemetry/instrumentation-fs': {
          enabled: false, // Disable file system instrumentation to reduce noise
        },
      }),
    ],
  });

  await sdk.start();
  return sdk;
}
