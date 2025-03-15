import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Configure the SDK with Jaeger Exporter
export async function createOpenTelemetrySDK(): Promise<NodeSDK> {
  const exporter = new JaegerExporter({
    endpoint: 'http://localhost:14268/api/traces',
  });

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'nestjs-todo-app',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    }),
    spanProcessor: new BatchSpanProcessor(exporter),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
    ],
  });

  await sdk.start();
  return sdk;
}
