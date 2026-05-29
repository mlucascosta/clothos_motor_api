/**
 * @fileoverview Cliente HTTP para API DirectData v3.
 * A autenticação é feita via query param `TOKEN` (não header).
 * @module infrastructure/providers/directdata/DirectDataHttpClient
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '@shared/infrastructure/FetchHttpClient.js';
import type {
  HttpRequestOptions,
  IHttpClient,
} from '@shared/infrastructure/IHttpClient.js';

/**
 * Cliente HTTP DirectData v3 com autenticação via query param TOKEN.
 * Implementa `IHttpClient` para padrão de adaptador.
 *
 * @class DirectDataHttpClient
 * @implements {IHttpClient}
 */
export class DirectDataHttpClient implements IHttpClient {
  /** @type {FetchHttpClient} Cliente HTTP encapsulado */
  private readonly http: FetchHttpClient;
  /** @type {string} Token de API para query param TOKEN */
  private readonly apiKey: string;

  /**
   * Constrói cliente HTTP DirectData com autenticação via query param.
   *
   * @param {string} apiKey - Token/API Key da DirectData (ex: 6356F438-...)
   * @param {string} baseUrl - URL base da API (ex: https://apiv3.directd.com.br)
   */
  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName: 'directdata',
      defaultHeaders: {
        Accept: 'application/json',
      },
      defaultTimeoutMs: 60_000,
    });
  }

  /**
   * Realiza requisição HTTP à API DirectData.
   * Injeta automaticamente o query param `TOKEN` em todas as chamadas.
   * Retorna Either com erro ou resposta parseada.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} path - Caminho relativo (ex: /api/CadastroPessoaFisica)
   * @param {HttpRequestOptions} [options] - Opções (method, params, body, etc.)
   * @returns {Promise<Either<SourceError, T>>} Resposta ou erro de source
   */
  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    const mergedOptions: HttpRequestOptions = {
      ...options,
      params: {
        TOKEN: this.apiKey,
        ...options?.params,
      },
    };
    return this.http.request<T>(path, mergedOptions);
  }

  /**
   * Realiza requisição HTTP à API DirectData e retorna dados binários brutos.
   * Injeta automaticamente o query param `TOKEN` em todas as chamadas.
   *
   * @param {string} path - Caminho relativo
   * @param {HttpRequestOptions} [options] - Opções (method, params, body, etc.)
   * @returns {Promise<Either<SourceError, ArrayBuffer>>} ArrayBuffer ou erro de source
   */
  requestRaw(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, ArrayBuffer>> {
    const mergedOptions: HttpRequestOptions = {
      ...options,
      params: {
        TOKEN: this.apiKey,
        ...options?.params,
      },
    };
    return this.http.requestRaw(path, mergedOptions);
  }
}
