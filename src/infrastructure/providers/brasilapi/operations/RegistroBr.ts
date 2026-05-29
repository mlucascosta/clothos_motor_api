/**
 * @fileoverview Operation BrasilAPI para consulta de informações de domínio .br no Registro.br.
 * Consome o endpoint `/registrobr/v1/{domain}` para obter dados de registro,
 * titularidade e status de um domínio sob o ccTLD `.br`.
 * @module infrastructure/providers/brasilapi/operations/RegistroBr
 */

import { isLeft, left } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SourceError as SourceErrorType } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { RegistroBrSchema } from '../dtos/RegistroBrDto.js';
import type { RegistroBrDto } from '../dtos/RegistroBrDto.js';
import type { IRegistroBr } from '../ports/IRegistroBr.js';

/**
 * Consulta informações de registro de um domínio .br via BrasilAPI.
 *
 * Retorna dados de titularidade, datas de criação/expiração e status do domínio
 * conforme registrado no Registro.br.
 *
 * @class RegistroBr
 * @implements {IRegistroBr}
 *
 * @example
 * const op = new RegistroBr(httpClient);
 * const result = await op.execute({ domain: 'exemplo.com.br' });
 */
export class RegistroBr implements IRegistroBr {
  /** Path do endpoint com placeholder `{domain}` a ser substituído em execução. */
  readonly path = '/registrobr/v1/{domain}';

  /**
   * @param http - Cliente HTTP injetado (normalmente {@link BrasilApiHttpClient}).
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa a consulta de domínio .br no Registro.br via BrasilAPI.
   *
   * Fluxo:
   * 1. Extrai `params['domain']`; retorna erro se ausente.
   * 2. Interpola o domínio no `path` (sem sanitização — domínios são alfanuméricos com hífens).
   * 3. Realiza GET e valida a resposta com `RegistroBrSchema`.
   *
   * @param params - Deve conter `domain` (ex.: `'exemplo.com.br'`).
   * @returns `Either` com `SourceError` em falha ou {@link RegistroBrDto} em sucesso.
   */
  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceErrorType, RegistroBrDto>> {
    const domain = params['domain'];
    if (!domain) {
      return left(new SourceError('UPSTREAM_ERROR', 'brasilapi', 'Parâmetro domain obrigatório'));
    }
    const resolvedPath = this.path.replace('{domain}', domain);
    const result = await this.http.request<unknown>(resolvedPath);
    if (isLeft(result)) return result;
    return parseOrSchemaError(RegistroBrSchema, result.value, 'brasilapi');
  }
}
