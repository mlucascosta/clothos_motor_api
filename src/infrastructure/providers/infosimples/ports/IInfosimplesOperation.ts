/**
 * @fileoverview Port (interface) para todas as operations do Infosimples.
 * Define o contrato que cada endpoint do portal de consultas deve implementar.
 * @module infrastructure/providers/infosimples/ports/IInfosimplesOperation
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

/**
 * Port genérico que define o contrato de toda operation do Infosimples.
 * O tipo T representa o DTO específico do retorno de cada endpoint.
 *
 * @interface IInfosimplesOperation
 * @template T - Tipo do retorno específico do endpoint (items em `data`)
 */
export interface IInfosimplesOperation<T = unknown> {
  /** Path relativo do endpoint na API Infosimples (ex: /consultas/receita-federal/cpf) */
  readonly path: string;

  /** Parâmetros obrigatórios para esta operação. Usado para validação pré-requisição. */
  readonly requiredParams?: string[];

  /**
   * Executa a consulta no endpoint específico.
   *
   * @param {Record<string, string | undefined>} params - Query params da requisição
   * @returns {Promise<Either<SourceError, { code: number; header: InfosimplesResponseHeader; data: T[] | null; errors: string[] }>>}
   */
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
