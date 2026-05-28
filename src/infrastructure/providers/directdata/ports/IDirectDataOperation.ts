/**
 * @fileoverview Port (interface) para todas as operations do DirectData.
 * Define o contrato que cada endpoint do marketplace deve implementar.
 * @module infrastructure/providers/directdata/ports/IDirectDataOperation
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataResponseDto } from '../dtos/DirectDataResponseDto.js';

/**
 * Input genérico para qualquer operation DirectData.
 * Cada endpoint recebe query params específicos como Record.
 *
 * @interface DirectDataOperationInput
 */
export interface DirectDataOperationInput {
  params: Record<string, string | undefined>;
}

/**
 * Port que define o contrato de toda operation do DirectData.
 * Segue o padrão do projeto: uma interface por operação, implementação concreta separada.
 *
 * @interface IDirectDataOperation
 */
export interface IDirectDataOperation {
  /** Path relativo do endpoint na API DirectData (ex: /api/CadastroPessoaFisica) */
  readonly path: string;

  /**
   * Executa a consulta no endpoint específico.
   *
   * @param {DirectDataOperationInput} input - Query params da requisição
   * @returns {Promise<Either<SourceError, DirectDataResponseDto>>} Resposta validada ou erro
   */
  execute(input: DirectDataOperationInput): Promise<Either<SourceError, DirectDataResponseDto>>;
}
