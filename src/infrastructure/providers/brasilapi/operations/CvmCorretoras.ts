/**
 * @fileoverview Operation BrasilAPI para listagem de todas as corretoras registradas na CVM.
 * Consome o endpoint `/cvm/corretoras/v1` sem parâmetros e retorna a lista
 * completa de corretoras com dados cadastrais e de registro.
 * @module infrastructure/providers/brasilapi/operations/CvmCorretoras
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CvmCorretoraListSchema } from '../dtos/CvmCorretoraDto.js';
import type { CvmCorretoraDto } from '../dtos/CvmCorretoraDto.js';
import type { ICvmCorretoras } from '../ports/ICvmCorretoras.js';

/**
 * Lista todas as corretoras registradas na CVM via BrasilAPI.
 *
 * Não exige parâmetros — o endpoint retorna a lista completa sem filtros.
 * Para consultar uma corretora específica por CNPJ, use {@link CvmCorretora}.
 *
 * @class CvmCorretoras
 * @implements {ICvmCorretoras}
 *
 * @example
 * const op = new CvmCorretoras(httpClient);
 * const result = await op.execute({});
 */
export class CvmCorretoras implements ICvmCorretoras {
  /** Path fixo do endpoint — sem placeholders, não exige parâmetros. */
  readonly path = '/cvm/corretoras/v1';

  /**
   * @param http - Cliente HTTP injetado (normalmente {@link BrasilApiHttpClient}).
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa a listagem completa de corretoras CVM na BrasilAPI.
   *
   * Parâmetros são ignorados (`_params`) — o endpoint não aceita filtros.
   * A resposta é validada contra `CvmCorretoraListSchema` (array de {@link CvmCorretoraDto}).
   *
   * @param _params - Ignorado. Nenhum parâmetro é necessário.
   * @returns `Either` com `SourceError` em falha ou array de {@link CvmCorretoraDto} em sucesso.
   */
  async execute(
    _params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CvmCorretoraDto[]>> {
    const result = await this.http.request<unknown>(this.path);
    if (isLeft(result)) return result;
    return parseOrSchemaError(CvmCorretoraListSchema, result.value, 'brasilapi');
  }
}
