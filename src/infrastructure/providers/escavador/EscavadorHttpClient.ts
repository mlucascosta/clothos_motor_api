import { FetchHttpClient } from '../../../shared/infrastructure/FetchHttpClient.js';
import type { IHttpClient, HttpRequestOptions } from '../../../shared/infrastructure/IHttpClient.js';
import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';

export class EscavadorHttpClient implements IHttpClient {
  private readonly http: FetchHttpClient;

  constructor(apiKey: string, baseUrl: string) {
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName: 'escavador',
      defaultHeaders: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      defaultTimeoutMs: 30_000,
    });
  }

  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    return this.http.request<T>(path, options);
  }
}
