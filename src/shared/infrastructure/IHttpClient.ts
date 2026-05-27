import type { Either } from '../domain/Either.js';
import type { SourceError } from '../domain/errors/SourceError.js';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export interface IHttpClient {
  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>>;
}
