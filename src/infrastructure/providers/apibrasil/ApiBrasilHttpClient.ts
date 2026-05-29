import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '../../../shared/infrastructure/FetchHttpClient.js';
import type { HttpRequestOptions, IHttpClient } from '../../../shared/infrastructure/IHttpClient.js';

export class ApiBrasilHttpClient implements IHttpClient {
  private readonly http: FetchHttpClient;
  private readonly apiKey: string;
  private readonly deviceToken: string;

  constructor(apiKey: string, deviceToken: string, baseUrl: string = 'https://gateway.apibrasil.io/api/v2') {
    this.apiKey = apiKey;
    this.deviceToken = deviceToken;
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName: 'apibrasil',
      defaultHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        DeviceToken: deviceToken,
      },
      defaultTimeoutMs: 60_000,
    });
  }

  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    const mergedOptions: HttpRequestOptions = {
      ...options,
      method: 'POST',
    };
    return this.http.request<T>(path, mergedOptions);
  }

  requestRaw(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, ArrayBuffer>> {
    const mergedOptions: HttpRequestOptions = {
      ...options,
      method: 'POST',
    };
    return this.http.requestRaw(path, mergedOptions);
  }
}
