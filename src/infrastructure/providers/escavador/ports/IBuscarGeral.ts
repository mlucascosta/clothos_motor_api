/**
 * @fileoverview Port (contrato) para operação de busca genérica no Escavador.
 * Define input/output esperados da operação, agnóstico de implementação.
 * @module infrastructure/providers/escavador/ports/IBuscarGeral
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { BuscaGeralResponse } from '../dtos/BuscaGeralDto.js';

/**
 * Parâmetros de entrada para busca genérica.
 * Mapeia-se para `GET /api/v1/busca?q=...&type=...&page=...`
 *
 * @typedef {Object} BuscarGeralInput
 * @property {string} query - Termo de busca
 * @property {'pessoa' | 'processo' | 'instituicao'} [tipo] - Filtrar por tipo de entidade
 * @property {number} [pagina] - Número da página (1-indexed)
 */
export interface BuscarGeralInput {
  /** Termo de busca (nome, documento, etc.) */
  query: string;
  /** Filtrar por tipo de resultado */
  tipo?: 'pessoa' | 'processo' | 'instituicao';
  /** Número da página (padrão: 1) */
  pagina?: number;
}

/**
 * Port (interface) para operação de busca genérica.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber parâmetros de busca
 * - Executar contra API Escavador
 * - Retornar Either com erro ou resultados
 *
 * @interface IBuscarGeral
 */
export interface IBuscarGeral {
  /**
   * Executa busca genérica no Escavador.
   *
   * Busca por qualquer termo em todas as entidades:
   * - Pessoas físicas (por nome)
   * - Empresas (por nome ou documento)
   * - Processos (por número ou palavra-chave)
   * - Advogados (por nome ou registro)
   *
   * @async
   * @param {BuscarGeralInput} input - Parâmetros de busca
   * @returns {Promise<Either<SourceError, BuscaGeralResponse>>} Resultados ou erro
   */
  execute(input: BuscarGeralInput): Promise<Either<SourceError, BuscaGeralResponse>>;
}
