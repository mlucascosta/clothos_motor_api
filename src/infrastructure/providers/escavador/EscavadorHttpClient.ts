/**
 * @fileoverview Cliente HTTP para API Escavador v1.
 * Wrapper de autenticação (Bearer token) e defaults de timeout.
 * @module infrastructure/providers/escavador/EscavadorHttpClient
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '@shared/infrastructure/FetchHttpClient.js';
import type { HttpRequestOptions, IHttpClient } from '@shared/infrastructure/IHttpClient.js';

/**
 * Cliente HTTP Escavador v1 com autenticação e defaults pré-configurados.
 * Implementa `IHttpClient` para padrão de adaptador.
 *
 * @class EscavadorHttpClient
 * @implements {IHttpClient}
 */
export class EscavadorHttpClient implements IHttpClient {
  /** @type {FetchHttpClient} Cliente HTTP encapsulado */
  private readonly http: FetchHttpClient;

  /**
   * Constrói cliente HTTP Escavador com autenticação Bearer.
   *
   * @param {string} apiKey - Chave API Escavador (autenticação)
   * @param {string} baseUrl - URL base da API (ex: https://api.escavador.com.br)
   */
  constructor(apiKey: string, baseUrl: string, sourceName = 'escavador') {
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName,
      defaultHeaders: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      defaultTimeoutMs: 30_000,
    });
  }

  /**
   * Realiza requisição HTTP à API Escavador.
   * Retorna Either com erro ou resposta parseada.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} path - Caminho relativo (ex: /api/v1/busca)
   * @param {HttpRequestOptions} [options] - Opções (method, params, body, etc.)
   * @returns {Promise<Either<SourceError, T>>} Resposta ou erro de source
   */
  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    return this.http.request<T>(path, options);
  }

  /**
   * Realiza requisição HTTP à API Escavador e retorna dados binários brutos.
   * Útil para downloads de arquivos (PDF, etc).
   *
   * @param {string} path - Caminho relativo (ex: /api/v2/documentos/123/download)
   * @param {HttpRequestOptions} [options] - Opções (method, params, body, etc.)
   * @returns {Promise<Either<SourceError, ArrayBuffer>>} ArrayBuffer ou erro de source
   */
  requestRaw(
    path: string,
    options?: HttpRequestOptions,
  ): Promise<Either<SourceError, ArrayBuffer>> {
    return this.http.requestRaw(path, options);
  }
}
