/**
 * @fileoverview Port (contrato) para obter detalhes completos de um processo jurídico.
 * Define operação para buscar informações detalhadas por número CNJ.
 * @module infrastructure/providers/escavador/ports/IObterDetalhesProcesso
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ProcessoDto } from '../dtos/ProcessoDto.js';

/**
 * Parâmetros de entrada para obter detalhes de processo.
 * Mapeia-se para busca por número CNJ (00000000-00.0000.0.00.0000).
 *
 * @typedef {Object} ObterDetalhesProcessoInput
 * @property {string} numeroCnj - Número do processo no formato CNJ nacional
 */
export interface ObterDetalhesProcessoInput {
  /** Número do processo no formato CNJ (ex: "0000000-00.0000.0.00.0000") */
  numeroCnj: string;
}

/**
 * Port (interface) para obter detalhes completos de um processo jurídico.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber número CNJ do processo
 * - Executar busca contra API Escavador
 * - Retornar Either com erro ou processo com partes e movimentações
 *
 * @interface IObterDetalhesProcesso
 */
export interface IObterDetalhesProcesso {
  /**
   * Obtém detalhes completos de um processo jurídico por número CNJ.
   *
   * Retorna informações:
   * - Identificação (número CNJ, tribunal, tipo ação)
   * - Datas (ajuizamento, última movimentação)
   * - Valor da causa
   * - Status (ativo/encerrado)
   * - Array de partes envolvidas com advogados
   * - Não inclui movimentações (usar IObterMovimentacoesProcesso para esse)
   *
   * @async
   * @param {ObterDetalhesProcessoInput} input - Número CNJ do processo
   * @returns {Promise<Either<SourceError, ProcessoDto>>} Detalhes do processo ou erro
   *
   * @example
   * ```typescript
   * const result = await obterDetalhesProcesso.execute({
   *   numeroCnj: "0000000-00.0000.0.00.0000"
   * });
   *
   * if (isLeft(result)) {
   *   console.error('Processo não encontrado:', result.value.message);
   * } else {
   *   const processo = result.value;
   *   console.log(`Tribunal: ${processo.tribunal}`);
   *   console.log(`Tipo: ${processo.tipo_acao}`);
   *   console.log(`Ativo: ${processo.ativo ? 'Sim' : 'Encerrado'}`);
   *   console.log(`Partes:`);
   *   processo.partes.forEach(p => {
   *     console.log(`  - ${p.nome} (${p.tipo_parte})`);
   *   });
   * }
   * ```
   */
  execute(input: ObterDetalhesProcessoInput): Promise<Either<SourceError, ProcessoDto>>;
}
