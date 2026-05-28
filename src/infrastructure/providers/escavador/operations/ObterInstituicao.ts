/**
 * @fileoverview Operação de obtenção de dados de instituição (empresa/CNPJ) no Escavador.
 * @module infrastructure/providers/escavador/operations/ObterInstituicao
 */

import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { type InstituicaoDto, InstituicaoDtoSchema } from '../dtos/InstituicaoDto.js';
import type { IObterInstituicao, ObterInstituicaoInput } from '../ports/IObterInstituicao.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

/**
 * Operação de obtenção de dados de instituição (GET /api/v1/instituicoes/{id}).
 *
 * @class ObterInstituicao
 * @implements {IObterInstituicao}
 */
export class ObterInstituicao implements IObterInstituicao {
  constructor(private readonly http: IHttpClient) {}

  /**
   * Obtém dados completos de instituição (empresa/CNPJ) pelo ID.
   *
   * @param {ObterInstituicaoInput} input - ID da instituição
   * @returns {Promise<Either<SourceError, InstituicaoDto>>} Dados da instituição ou erro
   */
  async execute(input: ObterInstituicaoInput): Promise<Either<SourceError, InstituicaoDto>> {
    const result = await this.http.request<unknown>(`/api/v1/instituicoes/${input.id}`);

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(InstituicaoDtoSchema, result.value, 'escavador');
  }
}
