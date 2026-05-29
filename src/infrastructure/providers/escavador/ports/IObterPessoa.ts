/**
 * @fileoverview Port (contrato) para obter dados de pessoa física no Escavador.
 * Define input/output esperados da operação, agnóstico de implementação HTTP.
 * @module infrastructure/providers/escavador/ports/IObterPessoa
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { PessoaDto } from '../dtos/PessoaDto.js';

/**
 * Parâmetros de entrada para obter dados de pessoa.
 * Mapeia-se para `GET /api/v1/pessoas/{id}`
 *
 * @typedef {Object} ObterPessoaInput
 * @property {number} id - ID único da pessoa no Escavador
 */
export interface ObterPessoaInput {
  /** ID único da pessoa no Escavador (obtido via BuscarGeral) */
  id: number;
}

/**
 * Port (interface) para obter detalhes de uma pessoa física.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber ID da pessoa
 * - Executar GET contra API Escavador
 * - Retornar Either com erro ou dados da pessoa
 *
 * @interface IObterPessoa
 */
export interface IObterPessoa {
  /**
   * Obtém detalhes completos de uma pessoa física.
   *
   * Retorna informações como:
   * - Nome completo
   * - CPF (se disponível)
   * - Data de nascimento
   * - Total de processos associados
   * - URL para visualizar no Escavador
   *
   * @async
   * @param {ObterPessoaInput} input - ID da pessoa
   * @returns {Promise<Either<SourceError, PessoaDto>>} Dados da pessoa ou erro
   *
   * @example
   * ```typescript
   * const result = await obterPessoa.execute({ id: 123 });
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao obter pessoa:', result.value.message);
   * } else {
   *   console.log('Nome:', result.value.nome);
   *   console.log('Processos:', result.value.quantidade_processos);
   * }
   * ```
   */
  execute(input: ObterPessoaInput): Promise<Either<SourceError, PessoaDto>>;
}
