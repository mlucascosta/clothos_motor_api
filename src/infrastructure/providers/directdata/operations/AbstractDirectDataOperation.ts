/**
 * @fileoverview Classe base abstrata para operations do DirectData.
 * Centraliza a lógica de HTTP + validação de schema; subclasses definem apenas o path.
 * @module infrastructure/providers/directdata/operations/AbstractDirectDataOperation
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type DirectDataResponseDto,
  DirectDataResponseSchema,
} from '../dtos/DirectDataResponseDto.js';
import type {
  DirectDataOperationInput,
  IDirectDataOperation,
} from '../ports/IDirectDataOperation.js';

/**
 * Base comum para todas as operations do DirectData.
 * Implementa o execute() genérico (GET + validação Zod).
 * Subclasses obrigatórias: definir `path`.
 *
 * @abstract
 * @class AbstractDirectDataOperation
 * @implements {IDirectDataOperation}
 */
export abstract class AbstractDirectDataOperation implements IDirectDataOperation {
  /** Path do endpoint na API DirectData (deve ser sobrescrito) */
  abstract readonly path: string;

  /**
   * @param {IHttpClient} http - Cliente HTTP injetado
   */
  constructor(protected readonly http: IHttpClient) {}

  /**
   * Executa requisição GET no path da subclass e valida resposta.
   *
   * @async
   * @param {DirectDataOperationInput} input - Query params
   * @returns {Promise<Either<SourceError, DirectDataResponseDto>>}
   */
  async execute(
    input: DirectDataOperationInput,
  ): Promise<Either<SourceError, DirectDataResponseDto>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(input.params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'GET',
      params: cleanParams,
    });

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(DirectDataResponseSchema, result.value, 'directdata');
  }
}
