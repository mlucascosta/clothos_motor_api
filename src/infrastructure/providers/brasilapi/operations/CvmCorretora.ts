/**
 * @fileoverview Operation BrasilAPI para consulta de uma corretora específica na CVM.
 * Consome o endpoint `/cvm/corretoras/v1/{cnpj}` para obter os dados cadastrais
 * de uma corretora registrada na Comissão de Valores Mobiliários (CVM).
 * @module infrastructure/providers/brasilapi/operations/CvmCorretora
 */

import { isLeft, left } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SourceError as SourceErrorType } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CvmCorretoraSchema } from '../dtos/CvmCorretoraDto.js';
import type { CvmCorretoraDto } from '../dtos/CvmCorretoraDto.js';
import type { ICvmCorretora } from '../ports/ICvmCorretora.js';

/**
 * Consulta dados de uma corretora registrada na CVM pelo CNPJ via BrasilAPI.
 *
 * Aceita CNPJ formatado ou apenas dígitos — não-dígitos são removidos antes
 * da interpolação no path.
 *
 * @class CvmCorretora
 * @implements {ICvmCorretora}
 *
 * @example
 * const op = new CvmCorretora(httpClient);
 * const result = await op.execute({ cnpj: '02332886000104' });
 */
export class CvmCorretora implements ICvmCorretora {
  /** Path do endpoint com placeholder `{cnpj}` a ser substituído em execução. */
  readonly path = '/cvm/corretoras/v1/{cnpj}';

  /**
   * @param http - Cliente HTTP injetado (normalmente {@link BrasilApiHttpClient}).
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa a consulta de corretora CVM por CNPJ na BrasilAPI.
   *
   * Fluxo:
   * 1. Extrai `params['cnpj']`; retorna erro se ausente.
   * 2. Remove não-dígitos do valor.
   * 3. Interpola os dígitos no `path`.
   * 4. Realiza GET e valida a resposta com `CvmCorretoraSchema`.
   *
   * @param params - Deve conter `cnpj` (obrigatório).
   * @returns `Either` com `SourceError` em falha ou {@link CvmCorretoraDto} em sucesso.
   */
  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceErrorType, CvmCorretoraDto>> {
    const cnpjRaw = params['cnpj'];
    if (!cnpjRaw) {
      return left(new SourceError('UPSTREAM_ERROR', 'brasilapi', 'Parâmetro cnpj obrigatório'));
    }
    const digits = cnpjRaw.replace(/\D/g, '');
    const resolvedPath = this.path.replace('{cnpj}', digits);
    const result = await this.http.request<unknown>(resolvedPath);
    if (isLeft(result)) return result;
    return parseOrSchemaError(CvmCorretoraSchema, result.value, 'brasilapi');
  }
}
