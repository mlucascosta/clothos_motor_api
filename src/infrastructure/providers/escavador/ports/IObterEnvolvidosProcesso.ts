/**
 * @fileoverview Port (contrato) para obter partes envolvidas em um processo jurídico.
 * Define operação para recuperar lista de envolvidos (autores, réus, advogados).
 * @module infrastructure/providers/escavador/ports/IObterEnvolvidosProcesso
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ProcessoEnvolvidosResponse } from '../dtos/ProcessoEnvolvidosDto.js';

/**
 * Parâmetros de entrada para obter partes envolvidas em processo.
 * Mapeia-se para `GET /api/v1/processos/{id}/envolvidos-diarios`
 *
 * @typedef {Object} ObterEnvolvidosProcessoInput
 * @property {number} id - ID do processo no Escavador (não é número CNJ, é ID interno)
 */
export interface ObterEnvolvidosProcessoInput {
  /** ID único do processo no Escavador (obtido em busca anterior) */
  id: number;
}

/**
 * Port (interface) para obter lista de partes envolvidas em um processo.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber ID do processo
 * - Executar GET contra API Escavador
 * - Retornar Either com erro ou lista de envolvidos
 *
 * @interface IObterEnvolvidosProcesso
 */
export interface IObterEnvolvidosProcesso {
  /**
   * Obtém lista de partes (pessoas/empresas) envolvidas em um processo.
   *
   * Retorna array com:
   * - Nome do envolvido
   * - Tipo de participação (Autor, Réu, Terceiro, etc.)
   * - Advogados que o representam (nome + OAB)
   * - Dados pessoais quando disponíveis
   *
   * Útil para análise de redes de relacionamento e identificação de padrões.
   *
   * @async
   * @param {ObterEnvolvidosProcessoInput} input - ID do processo
   * @returns {Promise<Either<SourceError, ProcessoEnvolvidosResponse>>} Lista de envolvidos ou erro
   *
   * @example
   * ```typescript
   * const result = await obterEnvolvidosProcesso.execute({ id: 789 });
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao obter envolvidos:', result.value.message);
   * } else {
   *   const response = result.value;
   *   console.log(`Partes envolvidas: ${response.items.length}`);
   *   response.items.forEach(envolvido => {
   *     console.log(`${envolvido.nome} (${envolvido.tipo_parte})`);
   *     if (envolvido.advogados) {
   *       envolvido.advogados.forEach(adv => {
   *         console.log(`  Representado por: ${adv.nome} (OAB: ${adv.oab})`);
   *       });
   *     }
   *   });
   * }
   * ```
   */
  execute(
    input: ObterEnvolvidosProcessoInput,
  ): Promise<Either<SourceError, ProcessoEnvolvidosResponse>>;
}
