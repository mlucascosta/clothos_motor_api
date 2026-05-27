/**
 * @fileoverview Operação de listagem de processos de uma pessoa.
 * @module infrastructure/providers/escavador/operations/ObterProcessosPessoa
 */

import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { type PessoaProcessosResponse, PessoaProcessosResponseSchema } from '../dtos/PessoaDto.js';
import type {
  IObterProcessosPessoa,
  ObterProcessosPessoaInput,
} from '../ports/IObterProcessosPessoa.js';

/**
 * Operação de listagem de processos de uma pessoa (GET /api/v1/pessoas/{id}/processos).
 *
 * @class ObterProcessosPessoa
 * @implements {IObterProcessosPessoa}
 */
export class ObterProcessosPessoa implements IObterProcessosPessoa {
  constructor(private readonly http: IHttpClient) {}

  /**
   * Obtém lista paginada de processos jurídicos associados a uma pessoa.
   *
   * @param {ObterProcessosPessoaInput} input - ID da pessoa e página
   * @returns {Promise<Either<SourceError, PessoaProcessosResponse>>} Processos ou erro
   */
  async execute(
    input: ObterProcessosPessoaInput,
  ): Promise<Either<SourceError, PessoaProcessosResponse>> {
    const result = await this.http.request<unknown>(`/api/v1/pessoas/${input.id}/processos`, {
      params: {
        page: input.pagina,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = PessoaProcessosResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
