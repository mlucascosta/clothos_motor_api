/**
 * @fileoverview Cliente HTTP dedicado à BrasilAPI.
 * Wrapper GET-only sobre FetchHttpClient — a BrasilAPI é pública e não exige
 * autenticação. Força `method: 'GET'` em todas as requisições, independentemente
 * do que o chamador passe em `options`.
 * @module infrastructure/providers/brasilapi/BrasilApiHttpClient
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '@shared/infrastructure/FetchHttpClient.js';
import type { HttpRequestOptions, IHttpClient } from '@shared/infrastructure/IHttpClient.js';

/**
 * Cliente HTTP para a BrasilAPI.
 *
 * Encapsula um {@link FetchHttpClient} pré-configurado com:
 * - `sourceName: 'brasilapi'` para rastreamento de erros
 * - `defaultTimeoutMs: 30_000` (30 s)
 * - Header `Accept: application/json`
 *
 * Ambos os métodos públicos forçam `method: 'GET'`, garantindo que a API
 * pública nunca receba requisições de escrita acidentais.
 *
 * @class BrasilApiHttpClient
 * @implements {IHttpClient}
 *
 * @example
 * const client = new BrasilApiHttpClient();
 * const result = await client.request<CnpjDto>('/cnpj/v1/00000000000191');
 */
export class BrasilApiHttpClient implements IHttpClient {
  private readonly http: FetchHttpClient;

  /**
   * Cria uma instância do cliente com a base URL fornecida.
   *
   * @param baseUrl - URL base da BrasilAPI. Padrão: `'https://brasilapi.com.br/api'`.
   *   Pode ser sobrescrita via env var `BRASILAPI_BASE_URL` na camada de rota.
   */
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

  /**
   * Executa uma requisição GET tipada contra a BrasilAPI.
   * Ignora qualquer `method` passado em `options` e força `GET`.
   *
   * @template T - Tipo esperado do corpo da resposta JSON.
   * @param path - Path relativo ao `baseUrl` (ex.: `/cnpj/v1/00000000000191`).
   * @param options - Opções adicionais de requisição. `method` é ignorado.
   * @returns `Either` com {@link SourceError} em caso de falha ou `T` em sucesso.
   */
  request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    return this.http.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * Executa uma requisição GET e retorna o corpo bruto como `ArrayBuffer`.
   * Útil para endpoints que retornam dados binários.
   * Força `method: 'GET'`, assim como {@link request}.
   *
   * @param path - Path relativo ao `baseUrl`.
   * @param options - Opções adicionais de requisição. `method` é ignorado.
   * @returns `Either` com {@link SourceError} em caso de falha ou `ArrayBuffer` em sucesso.
   */
  requestRaw(
    path: string,
    options?: HttpRequestOptions,
  ): Promise<Either<SourceError, ArrayBuffer>> {
    return this.http.requestRaw(path, { ...options, method: 'GET' });
  }
}
