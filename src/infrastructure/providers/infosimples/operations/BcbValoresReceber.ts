/**
 * @fileoverview Operation — BCB / Valores a Receber
 * Endpoint: POST consultas/bcb/valores-receber
 * @module infrastructure/providers/infosimples/operations/BcbValoresReceber
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type BcbValoresReceberItem,
  BcbValoresReceberResponseSchema,
} from '../dtos/BcbValoresReceberDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class BcbValoresReceber implements IInfosimplesOperation<BcbValoresReceberItem> {
  readonly path = 'consultas/bcb/valores-receber';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, BcbValoresReceberItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(BcbValoresReceberResponseSchema, result.value, 'infosimples');
  }
}
