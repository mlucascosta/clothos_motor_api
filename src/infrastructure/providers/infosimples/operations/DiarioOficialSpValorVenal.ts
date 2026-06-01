/**
 * @fileoverview Operation DiarioOficialSpValorVenal — Infosimples API.
 * Endpoint: POST consultas/diario-oficial/sp/valor-venal
 * @module infrastructure/providers/infosimples/operations/DiarioOficialSpValorVenal
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type DiarioOficialSpValorVenalItem,
  DiarioOficialSpValorVenalResponseSchema,
} from '../dtos/DiarioOficialSpValorVenalDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class DiarioOficialSpValorVenal
  implements IInfosimplesOperation<DiarioOficialSpValorVenalItem>
{
  readonly path = 'consultas/diario-oficial/sp/valor-venal';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, DiarioOficialSpValorVenalItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(DiarioOficialSpValorVenalResponseSchema, result.value, 'infosimples');
  }
}
