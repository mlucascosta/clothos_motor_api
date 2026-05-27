/**
 * @fileoverview Port (contrato) para obter dados de instituição (empresa) no Escavador.
 * Define input/output esperados da operação, agnóstico de implementação HTTP.
 * @module infrastructure/providers/escavador/ports/IObterInstituicao
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { InstituicaoDto } from '../dtos/InstituicaoDto.js';

/**
 * Parâmetros de entrada para obter dados de instituição.
 * Mapeia-se para `GET /api/v1/instituicoes/{id}`
 *
 * @typedef {Object} ObterInstituicaoInput
 * @property {number} id - ID único da instituição no Escavador
 */
export interface ObterInstituicaoInput {
  /** ID único da instituição no Escavador (obtido via BuscarGeral) */
  id: number;
}

/**
 * Port (interface) para obter detalhes de uma instituição (empresa, órgão, etc.).
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber ID da instituição
 * - Executar GET contra API Escavador
 * - Retornar Either com erro ou dados da instituição
 *
 * @interface IObterInstituicao
 */
export interface IObterInstituicao {
  /**
   * Obtém detalhes completos de uma instituição (empresa ou órgão público).
   *
   * Retorna informações como:
   * - Nome da instituição
   * - CNPJ (se aplicável)
   * - Tipo de instituição
   * - Total de processos associados
   * - URL para visualizar no Escavador
   *
   * @async
   * @param {ObterInstituicaoInput} input - ID da instituição
   * @returns {Promise<Either<SourceError, InstituicaoDto>>} Dados da instituição ou erro
   *
   * @example
   * ```typescript
   * const result = await obterInstituicao.execute({ id: 456 });
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao obter instituição:', result.value.message);
   * } else {
   *   console.log('Nome:', result.value.nome);
   *   console.log('CNPJ:', result.value.cnpj);
   *   console.log('Processos:', result.value.quantidade_processos);
   * }
   * ```
   */
  execute(input: ObterInstituicaoInput): Promise<Either<SourceError, InstituicaoDto>>;
}
