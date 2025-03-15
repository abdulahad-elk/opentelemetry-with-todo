import { SetMetadata } from '@nestjs/common';
import {
  trace,
  context,
  SpanStatusCode,
  SpanAttributes,
} from '@opentelemetry/api';

export const TRACE_KEY = 'trace_span_name';

// For controllers (using interceptor)
export const Trace = (spanName?: string) => SetMetadata(TRACE_KEY, spanName);

// For service methods (direct tracing)
export function TraceMethod(spanName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      const tracer = trace.getTracer('app-tracer');
      const activeSpan = trace.getSpan(context.active());
      const ctx = activeSpan
        ? trace.setSpan(context.active(), activeSpan)
        : context.active();
      
      return tracer.startActiveSpan(
        spanName,
        {},
        ctx,
        async (span) => {
          try {
            // Set attributes
            span.setAttributes({
              method: propertyKey,
              class: target.constructor.name,
            } as SpanAttributes);
            
            // Call the original method
            const result = await originalMethod.apply(this, args);
            
            // Mark span as successful
            // This is the proper way to set success status
            span.setStatus({ code: SpanStatusCode.OK });
            span.end();
            
            return result;
          } catch (error) {
            // Handle errors
            console.error(`Error in ${spanName}:`, error);
            
            // Set error status - this is the proper way to mark a span as error
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error instanceof Error ? error.message : String(error),
            });
            
            // Record the exception to include stack trace and other details
            if (error instanceof Error) {
              span.recordException(error);
            }
            
            // End the span (must be done in both success and error paths)
            span.end();
            throw error;
          }
        }
      );
    };
    
    return descriptor;
  };
}
