/**
 * @fileoverview Port (contrato) para obter processos de uma pessoa física no Escavador.
 * Define input/output esperados da operação de listagem paginada.
 * @module infrastructure/providers/escavador/ports/IObterProcessosPessoa
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { PessoaProcessosResponse } from '../dtos/PessoaDto.js';

/**
 * Parâmetros de entrada para obter processos de uma pessoa.
 * Mapeia-se para `GET /api/v1/pessoas/{id}/processos?page=...`
 *
 * @typedef {Object} ObterProcessosPessoaInput
 * @property {number} id - ID único da pessoa no Escavador
 * @property {number} [pagina] - Número da página (1-indexed, padrão: 1)
 */
export interface ObterProcessosPessoaInput {
  /** ID único da pessoa no Escavador */
  id: number;
  /** Número da página para paginação (padrão: 1) */
  pagina?: number;
}

/**
 * Port (interface) para listar processos associados a uma pessoa física.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber ID da pessoa e número de página
 * - Executar GET contra API Escavador
 * - Retornar Either com erro ou lista paginada de processos
 *
 * @interface IObterProcessosPessoa
 */
export interface IObterProcessosPessoa {
  /**
   * Obtém processos associados a uma pessoa física com paginação.
   *
   * Retorna array de processos resumidos (sem movimentações completas).
   * Suporta paginação para pessoas com muitos processos.
   *
   * @async
   * @param {ObterProcessosPessoaInput} input - ID e página
   * @returns {Promise<Either<SourceError, PessoaProcessosResponse>>} Lista paginada de processos ou erro
   *
   * @example
   * ```typescript
   * const result = await obterProcessosPessoa.execute({
   *   id: 123,
   *   pagina: 1
   * });
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao obter processos:', result.value.message);
   * } else {
   *   console.log('Processos encontrados:', result.value.items.length);
   *   console.log('Total:', result.value.total);
   *   result.value.items.forEach(p => {
   *     console.log(`- ${p.numero_cnj} (${p.tribunal})`);
   *   });
   * }
   * ```
   */
  execute(input: ObterProcessosPessoaInput): Promise<Either<SourceError, PessoaProcessosResponse>>;
}
