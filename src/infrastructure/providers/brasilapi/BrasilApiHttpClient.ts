import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '@shared/infrastructure/FetchHttpClient.js';
import type { HttpRequestOptions, IHttpClient } from '@shared/infrastructure/IHttpClient.js';

export class BrasilApiHttpClient implements IHttpClient {
  private readonly http: FetchHttpClient;

  constructor(baseUrl = 'https://brasilapi.com.br/api') {
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName: 'brasilapi',
      defaultHeaders: {
        Accept: 'application/json',
      },
      defaultTimeoutMs: 30_000,
    });
  }

  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    return this.http.request<T>(path, { ...options, method: 'GET' });
  }

  requestRaw(
    path: string,
    options?: HttpRequestOptions,
  ): Promise<Either<SourceError, ArrayBuffer>> {
    return this.http.requestRaw(path, { ...options, method: 'GET' });
  }
}
