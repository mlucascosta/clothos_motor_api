/**
 * @fileoverview Operação de busca genérica (DSL livre) na API DataJud.
 * Envia body Elasticsearch para o endpoint `/{tribunal}/_search`.
 * @module infrastructure/providers/datajud/operations/BuscarGenericoDataJud
 */

import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { getDataJudPath } from '../DataJudTribunais.js';
import {
  type DataJudSearchResponseDto,
  DataJudSearchResponseSchema,
} from '../dtos/DataJudSearchResponseDto.js';
import type {
  BuscarGenericoDataJudInput,
  IBuscarGenericoDataJud,
} from '../ports/IBuscarGenericoDataJud.js';

/**
 * Operação de busca genérica no DataJud (POST /{tribunal}/_search).
 * Permite qualquer query DSL do Elasticsearch.
 *
 * @class BuscarGenericoDataJud
 * @implements {IBuscarGenericoDataJud}
 */
export class BuscarGenericoDataJud implements IBuscarGenericoDataJud {
  /**
   * @param {IHttpClient} http - Cliente HTTP ao DataJud
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa busca DSL no tribunal informado.
   *
   * @async
   * @param {BuscarGenericoDataJudInput} input - Sigla e body DSL
   * @returns {Promise<Either<SourceError, DataJudSearchResponseDto>>}
   */
  async execute(
    input: BuscarGenericoDataJudInput,
  ): Promise<Either<SourceError, DataJudSearchResponseDto>> {
    const path = getDataJudPath(input.sigla);
    if (!path) {
      return left(
        new SourceError('NOT_FOUND', 'datajud', `Tribunal '${input.sigla}' não encontrado`),
      );
    }
    const result = await this.http.request<unknown>(path, {
      method: 'POST',
      body: input.body,
    });

    if (result._tag === 'Left') return result;

    const parsed = DataJudSearchResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'datajud', parsed.error.message));
    }

    return right(parsed.data);
  }
}
