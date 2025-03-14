import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { Reflector } from '@nestjs/core';
import { TRACE_KEY } from '../decorators/trace.decorator';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TraceInterceptor.name);
  private readonly tracer = trace.getTracer('app-tracer');

  constructor(private readonly reflector: Reflector) {}

  private getTraceContext() {
    const span = trace.getSpan(context.active());
    if (!span) return {};

    const spanContext = span.spanContext();
    return {
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
    };
  }

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const spanName =
      this.reflector.get(TRACE_KEY, executionContext.getHandler()) ||
      `${executionContext.getClass().name}.${executionContext.getHandler().name}`;

    return new Observable((subscriber) => {
      this.tracer.startActiveSpan(spanName, (span) => {
        const traceContext = this.getTraceContext();

        // Log method entry
        this.logger.log(`Entering ${spanName}`, traceContext);

        next
          .handle()
          .pipe(
            tap({
              next: (value) => {
                // Log successful execution
                this.logger.log(
                  `Successfully executed ${spanName}`,
                  traceContext,
                );
                span.setStatus({ code: SpanStatusCode.OK });
                subscriber.next(value);
                subscriber.complete();
              },
              error: (error) => {
                // Log error
                span.setStatus({ code: SpanStatusCode.ERROR });
                this.logger.error(`Error in ${spanName}`, {
                  error: error instanceof Error ? error.stack : error,
                  ...traceContext,
                });
                subscriber.error(error);
              },
            }),
          )
          .subscribe();

        return span;
      });
    });
  }
}
