/**
 * @fileoverview Operation BrasilAPI para consulta de dados cadastrais de CNPJ.
 * Consome o endpoint público `/cnpj/v1/{cnpj}` e valida a resposta contra
 * {@link CnpjSchema} antes de retornar o DTO tipado.
 * @module infrastructure/providers/brasilapi/operations/Cnpj
 */

import { isLeft, left } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SourceError as SourceErrorType } from '@shared/domain/errors/SourceError.js';
import { cleanDocument } from '@shared/domain/identifiers.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CnpjSchema } from '../dtos/CnpjDto.js';
import type { CnpjDto } from '../dtos/CnpjDto.js';
import type { ICnpj } from '../ports/ICnpj.js';

/**
 * Consulta dados cadastrais de uma empresa pelo CNPJ via BrasilAPI.
 *
 * O CNPJ pode ser enviado formatado (`00.000.000/0001-91`) ou apenas com dígitos
 * (`00000000000191`) — não-dígitos são removidos antes da interpolação no path.
 *
 * @class Cnpj
 * @implements {ICnpj}
 *
 * @example
 * const op = new Cnpj(httpClient);
 * const result = await op.execute({ cnpj: '00.000.000/0001-91' });
 */
export class Cnpj implements ICnpj {
  /** Path do endpoint com placeholder `{cnpj}` a ser substituído em execução. */
  readonly path = '/cnpj/v1/{cnpj}';

  /**
   * @param http - Cliente HTTP injetado (normalmente {@link BrasilApiHttpClient}).
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa a consulta de CNPJ na BrasilAPI.
   *
   * Fluxo:
   * 1. Extrai `params['cnpj']`; retorna erro se ausente.
   * 2. Remove não-dígitos do valor.
   * 3. Interpola os dígitos no `path`.
   * 4. Realiza GET e valida a resposta com `CnpjSchema`.
   *
   * @param params - Deve conter `cnpj` (obrigatório).
   * @returns `Either` com `SourceError` em falha ou {@link CnpjDto} em sucesso.
   */
  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceErrorType, CnpjDto>> {
    const cnpjRaw = params['cnpj'];
    if (!cnpjRaw) {
      return left(new SourceError('UPSTREAM_ERROR', 'brasilapi', 'Parâmetro cnpj obrigatório'));
    }
    const cnpjClean = cleanDocument(cnpjRaw);
    const resolvedPath = this.path.replace('{cnpj}', cnpjClean);
    const result = await this.http.request<unknown>(resolvedPath);
    if (isLeft(result)) return result;
    return parseOrSchemaError(CnpjSchema, result.value, 'brasilapi');
  }
}
