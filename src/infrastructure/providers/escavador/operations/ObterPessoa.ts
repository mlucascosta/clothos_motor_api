/**
 * @fileoverview Operação de obtenção de dados de pessoa física no Escavador.
 * @module infrastructure/providers/escavador/operations/ObterPessoa
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type PessoaDto, PessoaDtoSchema } from '../dtos/PessoaDto.js';
import type { IObterPessoa, ObterPessoaInput } from '../ports/IObterPessoa.js';

/**
 * Operação de obtenção de dados de pessoa (GET /api/v1/pessoas/{id}).
 *
 * @class ObterPessoa
 * @implements {IObterPessoa}
 */
export class ObterPessoa implements IObterPessoa {
  constructor(private readonly http: IHttpClient) {}

  /**
   * Obtém dados completos de pessoa física pelo ID.
   *
   * @param {ObterPessoaInput} input - ID da pessoa
   * @returns {Promise<Either<SourceError, PessoaDto>>} Dados da pessoa ou erro
   */
  async execute(input: ObterPessoaInput): Promise<Either<SourceError, PessoaDto>> {
    const result = await this.http.request<unknown>(`/api/v1/pessoas/${input.id}`);

    if (isLeft(result)) return result;

    return parseOrSchemaError(PessoaDtoSchema, result.value, 'escavador');
  }
}
