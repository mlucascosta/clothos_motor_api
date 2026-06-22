/**
 * @fileoverview Cliente HTTP para API Gateway ApiBrasil v2.
 * Wrapper de autenticação (Bearer + DeviceToken) e defaults de timeout.
 * Força `method: 'POST'` em todas as requisições — exigência da API ApiBrasil.
 * @module infrastructure/providers/apibrasil/ApiBrasilHttpClient
 */

import { type Either, isRight, left } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '@shared/infrastructure/FetchHttpClient.js';
import type { HttpRequestOptions, IHttpClient } from '@shared/infrastructure/IHttpClient.js';

/**
 * Detecta o envelope de erro da ApiBrasil retornado com HTTP 200.
 * O gateway sinaliza falha com `error: true` no corpo (confirmado nos SDKs oficiais
 * `apigratis-*`), mantendo status HTTP 200 — sem este guard, uma consulta paga que
 * falhou na origem seria tratada como sucesso (crédito gasto à toa).
 */
function isApiBrasilErrorEnvelope(value: unknown): value is { error: true; message?: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>)['error'] === true
  );
}

/**
 * Cliente HTTP ApiBrasil v2 com autenticação Bearer + DeviceToken e defaults pré-configurados.
 * Implementa `IHttpClient` para padrão de adaptador.
 *
 * **Particularidades ApiBrasil:**
 * - Autenticação dupla: `Authorization: Bearer <apiKey>` + `DeviceToken: <deviceToken>`
 * - Todas as chamadas usam `POST`, independente da operação (override automático)
 * - Base URL padrão: `https://gateway.apibrasil.io/api/v2`
 * - Timeout padrão: 60 segundos (maior que Escavador/DataJud por processamento assíncrono)
 *
 * @class ApiBrasilHttpClient
 * @implements {IHttpClient}
 *
 * @example
 * ```typescript
 * const http = new ApiBrasilHttpClient(
 *   process.env['APIBRASIL_API_KEY']!,
 *   process.env['APIBRASIL_DEVICE_TOKEN']!,
 * );
 * const result = await http.request<CpfDadosDto>('/cpf-dados', { body: { cpf: numCpf } });
 * ```
 */
export class ApiBrasilHttpClient implements IHttpClient {
  /** @type {FetchHttpClient} Cliente HTTP encapsulado com headers de autenticação pré-configurados */
  private readonly http: FetchHttpClient;

  /**
   * Constrói cliente HTTP ApiBrasil com autenticação Bearer + DeviceToken.
   *
   * @param {string} apiKey - Chave API ApiBrasil para header `Authorization: Bearer <apiKey>`
   * @param {string} deviceToken - Token de dispositivo para header `DeviceToken: <deviceToken>`
   * @param {string} [baseUrl='https://gateway.apibrasil.io/api/v2'] - URL base da API
   */
  constructor(
    apiKey: string,
    deviceToken: string,
    baseUrl = 'https://gateway.apibrasil.io/api/v2',
  ) {
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

  /**
   * Realiza requisição HTTP à API ApiBrasil.
   * **Sempre usa `POST`**, independente do `method` passado nas options.
   * Retorna Either com erro ou resposta parseada.
   *
   * @template T - Tipo esperado da resposta (ex: `CpfDadosDto`, `CnpjDto`)
   * @param {string} path - Caminho relativo (ex: `/cpf-dados`, `/cnpj`)
   * @param {HttpRequestOptions} [options] - Opções adicionais (params, body, headers) — `method` é ignorado
   * @returns {Promise<Either<SourceError, T>>} Resposta tipada ou erro de source
   */
  async request<T>(path: string, options?: HttpRequestOptions): Promise<Either<SourceError, T>> {
    const mergedOptions: HttpRequestOptions = {
      ...options,
      method: 'POST',
    };
    const result = await this.http.request<T>(path, mergedOptions);
    // Guard de falso-sucesso: ApiBrasil sinaliza erro com `error: true` em HTTP 200.
    if (isRight(result) && isApiBrasilErrorEnvelope(result.value)) {
      const message =
        typeof result.value.message === 'string'
          ? result.value.message
          : 'ApiBrasil retornou error=true';
      return left(new SourceError('UPSTREAM_ERROR', 'apibrasil', message));
    }
    return result;
  }

  /**
   * Realiza requisição HTTP à API ApiBrasil e retorna dados binários brutos.
   * **Sempre usa `POST`**, independente do `method` passado nas options.
   * Útil para downloads de arquivos (ex: PDF de certidões).
   *
   * @param {string} path - Caminho relativo (ex: `/certidao/download`)
   * @param {HttpRequestOptions} [options] - Opções adicionais — `method` é ignorado
   * @returns {Promise<Either<SourceError, ArrayBuffer>>} ArrayBuffer ou erro de source
   */
  requestRaw(
    path: string,
    options?: HttpRequestOptions,
  ): Promise<Either<SourceError, ArrayBuffer>> {
    const mergedOptions: HttpRequestOptions = {
      ...options,
      method: 'POST',
    };
    return this.http.requestRaw(path, mergedOptions);
  }
}
