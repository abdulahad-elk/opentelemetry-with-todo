import { SetMetadata } from '@nestjs/common';

export const TRACE_KEY = 'trace_span_name';
export const Trace = (spanName?: string) => SetMetadata(TRACE_KEY, spanName);
