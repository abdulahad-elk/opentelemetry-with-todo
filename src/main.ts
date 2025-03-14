import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createOpenTelemetrySDK } from './config/tracing';

async function bootstrap() {
  // Initialize OpenTelemetry
  const otelSDK = await createOpenTelemetrySDK();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  // Gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    otelSDK
      .shutdown()
      .then(() => console.log('SDK shut down successfully'))
      .catch((error) => console.log('Error shutting down SDK', error))
      .finally(() => process.exit(0));
  });
}
void bootstrap();
