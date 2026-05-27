/**
 * @fileoverview Port (contrato) para obter processos de uma instituição no Escavador.
 * Define input/output esperados da operação de listagem paginada.
 * @module infrastructure/providers/escavador/ports/IObterProcessosInstituicao
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { PessoaProcessosResponse } from '../dtos/PessoaDto.js';

/**
 * Parâmetros de entrada para obter processos de uma instituição.
 * Mapeia-se para `GET /api/v1/instituicoes/{id}/processos?page=...`
 *
 * @typedef {Object} ObterProcessosInstituicaoInput
 * @property {number} id - ID único da instituição no Escavador
 * @property {number} [pagina] - Número da página (1-indexed, padrão: 1)
 */
export interface ObterProcessosInstituicaoInput {
  /** ID único da instituição no Escavador */
  id: number;
  /** Número da página para paginação (padrão: 1) */
  pagina?: number;
}

/**
 * Port (interface) para listar processos associados a uma instituição.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber ID da instituição e número de página
 * - Executar GET contra API Escavador
 * - Retornar Either com erro ou lista paginada de processos
 *
 * @interface IObterProcessosInstituicao
 */
export interface IObterProcessosInstituicao {
  /**
   * Obtém processos associados a uma instituição com paginação.
   *
   * Retorna array de processos resumidos (sem movimentações completas).
   * Suporta paginação para instituições com muitos processos.
   *
   * @async
   * @param {ObterProcessosInstituicaoInput} input - ID e página
   * @returns {Promise<Either<SourceError, PessoaProcessosResponse>>} Lista paginada de processos ou erro
   *
   * @example
   * ```typescript
   * const result = await obterProcessosInstituicao.execute({
   *   id: 456,
   *   pagina: 1
   * });
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao obter processos:', result.value.message);
   * } else {
   *   console.log('Processos encontrados:', result.value.items.length);
   *   console.log('Total:', result.value.total);
   * }
   * ```
   */
  execute(input: ObterProcessosInstituicaoInput): Promise<Either<SourceError, PessoaProcessosResponse>>;
}
