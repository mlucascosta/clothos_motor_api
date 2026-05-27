import { left, right, type Either } from '../domain/Either.js';
import { SourceError } from '../domain/errors/SourceError.js';
import type { HttpRequestOptions, IHttpClient } from './IHttpClient.js';

export interface FetchHttpClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  defaultTimeoutMs?: number;
  sourceName?: string;
}

export class FetchHttpClient implements IHttpClient {
  constructor(private readonly config: FetchHttpClientConfig) {}

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<Either<SourceError, T>> {
    const url = this.buildUrl(path, options.params);
    const timeoutMs = options.timeoutMs ?? this.config.defaultTimeoutMs ?? 30_000;
    const source = this.config.sourceName ?? 'http';

    try {
      const init: RequestInit = {
        method: options.method ?? 'GET',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...this.config.defaultHeaders,
          ...options.headers,
        },
      };
      if (options.body !== undefined) {
        init.body = JSON.stringify(options.body);
      }
      const response = await fetch(url, init);

      if (response.status === 401 || response.status === 403) {
        return left(new SourceError('AUTH_FAILED', source, `HTTP ${response.status}`));
      }

      if (response.status === 404) {
        return left(new SourceError('NOT_FOUND', source));
      }

      if (response.status === 429) {
        return left(new SourceError('RATE_LIMITED', source));
      }

      if (!response.ok) {
        return left(new SourceError('UPSTREAM_ERROR', source, `HTTP ${response.status}`));
      }

      const data = (await response.json()) as T;
      return right(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        return left(new SourceError('TIMEOUT', source));
      }
      return left(new SourceError('UPSTREAM_ERROR', source, err));
    }
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${base}${normalizedPath}`;

    if (!params) return url;

    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');

    return qs ? `${url}?${qs}` : url;
  }
}
