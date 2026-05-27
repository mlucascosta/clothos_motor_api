/**
 * @fileoverview Port para operação de busca genérica no DataJud.
 * @module infrastructure/providers/datajud/ports/IBuscarGenericoDataJud
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DataJudSearchResponseDto } from '../dtos/DataJudSearchResponseDto.js';

/**
 * Input para busca genérica no DataJud.
 * @interface BuscarGenericoDataJudInput
 */
export interface BuscarGenericoDataJudInput {
  /** Sigla do tribunal (ex: 'tjsp') */
  sigla: string;
  /** Body DSL completo para Elasticsearch */
  body: Record<string, unknown>;
}

/**
 * Contrato para busca genérica no DataJud.
 * @interface IBuscarGenericoDataJud
 */
export interface IBuscarGenericoDataJud {
  /**
   * Executa busca DSL no endpoint do tribunal informado.
   * @param {BuscarGenericoDataJudInput} input - Sigla e body DSL
   * @returns {Promise<Either<SourceError, DataJudSearchResponseDto>>} Resposta Elasticsearch ou erro
   */
  execute(
    input: BuscarGenericoDataJudInput,
  ): Promise<Either<SourceError, DataJudSearchResponseDto>>;
}
