/**
 * @fileoverview Port (interface) para todas as operations do DirectData.
 * Define o contrato que cada endpoint do marketplace deve implementar.
 * @module infrastructure/providers/directdata/ports/IDirectDataOperation
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Port genérico que define o contrato de toda operation do DirectData.
 * O tipo T representa o DTO específico do retorno de cada endpoint.
 *
 * @interface IDirectDataOperation
 * @template T - Tipo do retorno específico do endpoint
 */
export interface IDirectDataOperation<T = unknown> {
  /** Path relativo do endpoint na API DirectData (ex: /api/CadastroPessoaFisica) */
  readonly path: string;

  /**
   * Executa a consulta no endpoint específico.
   *
   * @param {Record<string, string | undefined>} params - Query params da requisição
   * @returns {Promise<Either<SourceError, { metaDados: DirectDataMetaDados; retorno: T | null }>>} Resposta validada ou erro
   */
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, { metaDados: DirectDataMetaDados; retorno: T | null }>>;
}
