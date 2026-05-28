/**
 * @fileoverview Operação de busca por número de processo na API DataJud.
 * Constrói query `match` por `numeroProcesso` automaticamente.
 * @module infrastructure/providers/datajud/operations/BuscarProcessoPorNumero
 */

import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { getDataJudPath } from '../DataJudTribunais.js';
import type { DataJudSearchResponseDto } from '../dtos/DataJudSearchResponseDto.js';
import { DataJudSearchResponseSchema } from '../dtos/DataJudSearchResponseDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

/**
 * Input para busca por número de processo.
 * @interface BuscarProcessoPorNumeroInput
 */
export interface BuscarProcessoPorNumeroInput {
  /** Sigla do tribunal */
  sigla: string;
  /** Número CNJ do processo */
  numeroProcesso: string;
  /** Tamanho da página (padrão 1) */
  size?: number;
}

/**
 * Operação de busca por número de processo no DataJud.
 * Monta query `match` por `numeroProcesso`.
 *
 * @class BuscarProcessoPorNumero
 */
import type { IBuscarProcessoPorNumero } from './IBuscarProcessoPorNumero.js';

export class BuscarProcessoPorNumero implements IBuscarProcessoPorNumero {
  /**
   * @param {IHttpClient} http - Cliente HTTP ao DataJud
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa busca por número de processo.
   *
   * @async
   * @param {BuscarProcessoPorNumeroInput} input
   * @returns {Promise<Either<SourceError, DataJudSearchResponseDto>>}
   */
  async execute(
    input: BuscarProcessoPorNumeroInput,
  ): Promise<Either<SourceError, DataJudSearchResponseDto>> {
    const path = getDataJudPath(input.sigla);
    if (!path) {
      return left(
        new SourceError('NOT_FOUND', 'datajud', `Tribunal '${input.sigla}' não encontrado`),
      );
    }
    // DataJud armazena numeroProcesso em 20 dígitos sem separadores
    const numeroLimpo = input.numeroProcesso.replace(/\D/g, '');
    const body = {
      query: {
        match: {
          numeroProcesso: numeroLimpo,
        },
      },
      size: input.size ?? 1,
    };

    const result = await this.http.request<unknown>(path, {
      method: 'POST',
      body,
    });

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(DataJudSearchResponseSchema, result.value, 'datajud');
  }
}
