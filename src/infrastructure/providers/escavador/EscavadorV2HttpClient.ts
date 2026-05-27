/**
 * @fileoverview Cliente HTTP para API Escavador v2.
 * Wrapper de autenticação (Bearer token) e defaults de timeout.
 * Versão 2 com endpoints expandidos para processos jurídicos.
 * @module infrastructure/providers/escavador/EscavadorV2HttpClient
 */

import { FetchHttpClient } from '../../../shared/infrastructure/FetchHttpClient.js';
import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';
import type { HttpRequestOptions, IHttpClient } from '../../../shared/infrastructure/IHttpClient.js';

/**
 * Cliente HTTP Escavador v2 com autenticação e defaults pré-configurados.
 * Implementa `IHttpClient` para padrão de adaptador.
 * Diferencia-se da v1 pelo sourceName ('escavador-v2') e endpoints disponibilizados.
 *
 * @class EscavadorV2HttpClient
 * @implements {IHttpClient}
 */
export class EscavadorV2HttpClient implements IHttpClient {
  /** @type {FetchHttpClient} Cliente HTTP encapsulado */
  private readonly http: FetchHttpClient;

  /**
   * Constrói cliente HTTP Escavador v2 com autenticação Bearer.
   *
   * @param {string} apiKey - Chave API Escavador (autenticação)
   * @param {string} baseUrl - URL base da API v2 (ex: https://api2.escavador.com.br)
   */
  constructor(apiKey: string, baseUrl: string) {
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName: 'escavador-v2',
      defaultHeaders: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      defaultTimeoutMs: 30_000,
    });
  }

  /**
   * Realiza requisição HTTP à API Escavador v2.
   * Retorna Either com erro ou resposta parseada.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} path - Caminho relativo (ex: /api/v2/processos)
   * @param {HttpRequestOptions} [options] - Opções (method, params, body, etc.)
   * @returns {Promise<Either<SourceError, T>>} Resposta ou erro de source
   */
  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    return this.http.request<T>(path, options);
  }
}
