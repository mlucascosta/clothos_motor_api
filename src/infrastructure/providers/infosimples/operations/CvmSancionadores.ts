/**
 * @fileoverview Operation — CVM / Sancionadores
 * Endpoint: POST consultas/cvm/sancionadores
 * @module infrastructure/providers/infosimples/operations/CvmSancionadores
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type CvmSancionadoresItem,
  CvmSancionadoresResponseSchema,
} from '../dtos/CvmSancionadoresDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class CvmSancionadores implements IInfosimplesOperation<CvmSancionadoresItem> {
  readonly path = 'consultas/cvm/sancionadores';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CvmSancionadoresItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(CvmSancionadoresResponseSchema, result.value);
  }
}
