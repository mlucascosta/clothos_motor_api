/**
 * @fileoverview Operação de obtenção de dados de pessoa física no Escavador.
 * @module infrastructure/providers/escavador/operations/ObterPessoa
 */

import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
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

    if (result._tag === 'Left') return result;

    const parsed = PessoaDtoSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
