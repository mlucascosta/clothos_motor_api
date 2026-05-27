/**
 * @fileoverview Cliente HTTP para API Pública DataJud (CNJ).
 * Wrapper de autenticação com APIKey e defaults de timeout.
 * @module infrastructure/providers/datajud/DataJudHttpClient
 */

import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '../../../shared/infrastructure/FetchHttpClient.js';
import type {
  HttpRequestOptions,
  IHttpClient,
} from '../../../shared/infrastructure/IHttpClient.js';

/**
 * Cliente HTTP DataJud com autenticação APIKey.
 * Implementa `IHttpClient` para padrão de adaptador.
 *
 * @class DataJudHttpClient
 * @implements {IHttpClient}
 */
export class DataJudHttpClient implements IHttpClient {
  /** @type {FetchHttpClient} Cliente HTTP encapsulado */
  private readonly http: FetchHttpClient;

  /**
   * Constrói cliente HTTP DataJud com autenticação APIKey.
   *
   * @param {string} apiKey - Chave API DataJud (autenticação)
   * @param {string} baseUrl - URL base da API (ex: https://api-publica.datajud.cnj.jus.br)
   */
  constructor(apiKey: string, baseUrl: string) {
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName: 'datajud',
      defaultHeaders: {
        Authorization: `APIKey ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      defaultTimeoutMs: 30_000,
    });
  }

  /**
   * Realiza requisição HTTP à API DataJud.
   * Retorna Either com erro ou resposta parseada.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} path - Caminho relativo (ex: /api_publica_tjsp/_search)
   * @param {HttpRequestOptions} [options] - Opções (method, body, etc.)
   * @returns {Promise<Either<SourceError, T>>} Resposta ou erro de source
   */
  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    return this.http.request<T>(path, options);
  }
}
