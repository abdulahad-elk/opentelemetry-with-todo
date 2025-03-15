import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  trace,
  context,
  SpanStatusCode,
  Span,
  SpanAttributes,
} from '@opentelemetry/api';
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
  ): Observable<unknown> {
    const spanName =
      this.reflector.get<string>(TRACE_KEY, executionContext.getHandler()) ||
      `${executionContext.getClass().name}.${executionContext.getHandler().name}`;

    const activeSpan = trace.getSpan(context.active());
    const ctx = activeSpan
      ? trace.setSpan(context.active(), activeSpan)
      : context.active();

    return new Observable((subscriber) => {
      this.tracer.startActiveSpan(spanName, {}, ctx, (span: Span) => {
        const traceContext = this.getTraceContext();
        const attributes: SpanAttributes = {
          method: executionContext.getHandler().name,
          class: executionContext.getClass().name,
        };

        span.setAttributes(attributes);

        this.logger.log(`Entering ${spanName}`, {
          ...traceContext,
          ...attributes,
        });

        next
          .handle()
          .pipe(
            tap({
              next: (value) => {
                this.logger.log(`Successfully executed ${spanName}`, {
                  ...traceContext,
                  ...attributes,
                });
                span.setStatus({ code: SpanStatusCode.OK });
                span.end();
                subscriber.next(value);
                subscriber.complete();
              },
            }),
            catchError((error: Error | HttpException) => {
              this.logger.error(`Error in ${spanName}`, {
                error: error instanceof Error ? error.stack : error,
                ...traceContext,
                ...attributes,
              });

              span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : String(error),
              });

              if (error instanceof Error) {
                span.recordException(error);
              }

              span.end();
              subscriber.error(error);
              return throwError(() => error);
            }),
          )
          .subscribe();

        return span;
      });
    });
  }
}
