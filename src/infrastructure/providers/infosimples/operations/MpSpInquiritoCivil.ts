/**
 * @fileoverview Operation — MP-SP / Inquérito Civil
 * Endpoint: POST consultas/mp/sp/inquerito-civil
 * @module infrastructure/providers/infosimples/operations/MpSpInquiritoCivil
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type MpSpInquiritoCivilItem,
  MpSpInquiritoCivilResponseSchema,
} from '../dtos/MpSpInquiritoCivilDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class MpSpInquiritoCivil implements IInfosimplesOperation<MpSpInquiritoCivilItem> {
  readonly path = 'consultas/mp/sp/inquerito-civil';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, MpSpInquiritoCivilItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(MpSpInquiritoCivilResponseSchema, result.value);
  }
}
