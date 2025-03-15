import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createOpenTelemetrySDK } from './config/tracing';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process
});

async function bootstrap() {
  // Initialize OpenTelemetry
  const otelSDK = await createOpenTelemetrySDK();

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
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
