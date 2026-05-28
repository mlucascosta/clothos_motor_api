/**
 * @fileoverview Cliente HTTP para API Infosimples v2.
 * A autenticação é feita via query param `token` (em minúsculas, diferente de Directdata).
 * @module infrastructure/providers/infosimples/InfosimplesHttpClient
 */

import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '../../../shared/infrastructure/FetchHttpClient.js';
import type {
  HttpRequestOptions,
  IHttpClient,
} from '../../../shared/infrastructure/IHttpClient.js';

/**
 * Cliente HTTP Infosimples v2 com autenticação via query param token.
 * Implementa `IHttpClient` para padrão de adaptador.
 *
 * **Diferenças com Directdata:**
 * - Query param é `token` (minúscolo), não `TOKEN`
 * - Base URL: https://api.infosimples.com/api/v2/
 * - Método: POST (não GET)
 * - Resposta: {code, data, errors, header} (não {metaDados, retorno})
 *
 * @class InfosimplesHttpClient
 * @implements {IHttpClient}
 */
export class InfosimplesHttpClient implements IHttpClient {
  /** @type {FetchHttpClient} Cliente HTTP encapsulado */
  private readonly http: FetchHttpClient;
  /** @type {string} Token de API para query param token */
  private readonly apiKey: string;

  /**
   * Constrói cliente HTTP Infosimples com autenticação via query param.
   *
   * @param {string} apiKey - Token da Infosimples (obtido em https://api.infosimples.com/)
   * @param {string} baseUrl - URL base da API (padrão: https://api.infosimples.com/api/v2/)
   */
  constructor(apiKey: string, baseUrl: string = 'https://api.infosimples.com/api/v2/') {
    this.apiKey = apiKey;
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName: 'infosimples',
      defaultHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      defaultTimeoutMs: 60_000,
    });
  }

  /**
   * Realiza requisição HTTP à API Infosimples.
   * Injeta automaticamente o query param `token` em todas as chamadas.
   * **Importante**: Infosimples usa POST mesmo para consultas de leitura.
   * Retorna Either com erro ou resposta parseada.
   *
   * @template T - Tipo esperado da resposta
   * @param {string} path - Caminho relativo (ex: /consultas/receita-federal/cpf)
   * @param {HttpRequestOptions} [options] - Opções (method, params, body, etc.)
   * @returns {Promise<Either<SourceError, T>>} Resposta ou erro de source
   */
  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    const mergedOptions: HttpRequestOptions = {
      ...options,
      method: 'POST', // Infosimples sempre usa POST
      params: {
        token: this.apiKey,
        ...options?.params,
      },
    };
    return this.http.request<T>(path, mergedOptions);
  }
}
