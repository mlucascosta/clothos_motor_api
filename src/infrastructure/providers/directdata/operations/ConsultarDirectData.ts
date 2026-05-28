/**
 * @fileoverview Operação genérica de consulta na API DirectData v3.
 * Encapsula qualquer endpoint GET do marketplace de APIs.
 * @module infrastructure/providers/directdata/operations/ConsultarDirectData
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type DirectDataResponseDto,
  DirectDataResponseSchema,
} from '../dtos/DirectDataResponseDto.js';

/**
 * Input para consulta genérica DirectData.
 *
 * @interface ConsultarDirectDataInput
 * @property {string} path - Caminho do endpoint (ex: /api/CadastroPessoaFisica)
 * @property {Record<string, string | undefined>} params - Query params da requisição
 */
export interface ConsultarDirectDataInput {
  path: string;
  params: Record<string, string | undefined>;
}

/**
 * Interface para operação genérica de consulta DirectData.
 * @interface IConsultarDirectData
 */
export interface IConsultarDirectData {
  /**
   * Executa consulta genérica à API DirectData.
   * @param {ConsultarDirectDataInput} input - Path e parâmetros
   * @returns {Promise<Either<SourceError, DirectDataResponseDto>>} Resposta ou erro
   */
  execute(input: ConsultarDirectDataInput): Promise<Either<SourceError, DirectDataResponseDto>>;
}

/**
 * Operação genérica de consulta na API DirectData.
 *
 * @class ConsultarDirectData
 * @implements {IConsultarDirectData}
 */
export class ConsultarDirectData implements IConsultarDirectData {
  /**
   * @param {IHttpClient} http - Cliente HTTP à DirectData
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa consulta GET genérica no endpoint informado.
   *
   * @async
   * @param {ConsultarDirectDataInput} input - Path e query params
   * @returns {Promise<Either<SourceError, DirectDataResponseDto>>}
   */
  async execute(
    input: ConsultarDirectDataInput,
  ): Promise<Either<SourceError, DirectDataResponseDto>> {
    // Filtra params undefined para não poluir a query string
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(input.params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(input.path, {
      method: 'GET',
      params: cleanParams,
    });

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(DirectDataResponseSchema, result.value, 'directdata');
  }
}
