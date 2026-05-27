/**
 * @fileoverview Port (contrato) para obter movimentações (timeline) de um processo.
 * Define operação de listagem paginada de eventos processuais.
 * @module infrastructure/providers/escavador/ports/IObterMovimentacoesProcesso
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MovimentacoesResponse } from '../dtos/MovimentacaoDto.js';

/**
 * Parâmetros de entrada para obter movimentações de processo.
 * Mapeia-se para busca de timeline de eventos processuais.
 *
 * @typedef {Object} ObterMovimentacoesProcessoInput
 * @property {string} numeroCnj - Número do processo no formato CNJ
 * @property {number} [pagina] - Número da página (1-indexed, padrão: 1)
 */
export interface ObterMovimentacoesProcessoInput {
  /** Número do processo no formato CNJ (ex: "0000000-00.0000.0.00.0000") */
  numeroCnj: string;
  /** Número da página para paginação (padrão: 1) */
  pagina?: number;
}

/**
 * Port (interface) para obter histórico de movimentações (eventos) de um processo.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber número CNJ e página
 * - Executar busca contra API Escavador
 * - Retornar Either com erro ou lista paginada de movimentações
 *
 * @interface IObterMovimentacoesProcesso
 */
export interface IObterMovimentacoesProcesso {
  /**
   * Obtém histórico de movimentações (timeline) de um processo com paginação.
   *
   * Retorna array cronológico de eventos processuais:
   * - Data do evento
   * - Tipo de movimentação (Sentença, Apelação, etc.)
   * - Descrição detalhada
   * - URL do documento associado (quando disponível)
   *
   * Movimentações estão geralmente em ordem cronológica descendente (mais recente primeiro).
   *
   * @async
   * @param {ObterMovimentacoesProcessoInput} input - Número CNJ e página
   * @returns {Promise<Either<SourceError, MovimentacoesResponse>>} Lista paginada de movimentações ou erro
   *
   * @example
   * ```typescript
   * const result = await obterMovimentacoesProcesso.execute({
   *   numeroCnj: "0000000-00.0000.0.00.0000",
   *   pagina: 1
   * });
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao obter movimentações:', result.value.message);
   * } else {
   *   const response = result.value;
   *   console.log(`Total de movimentações: ${response.total}`);
   *   response.items.forEach(mov => {
   *     console.log(`${mov.data} - ${mov.tipo}: ${mov.descricao}`);
   *     if (mov.documento_url) {
   *       console.log(`  Documentos: ${mov.documento_url}`);
   *     }
   *   });
   * }
   * ```
   */
  execute(
    input: ObterMovimentacoesProcessoInput,
  ): Promise<Either<SourceError, MovimentacoesResponse>>;
}
