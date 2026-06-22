/**
 * @fileoverview Operation — MPF / Lava Jato
 * Endpoint: POST consultas/mpf/lava-jato
 * @module infrastructure/providers/infosimples/operations/MpfLavaJato
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import { type MpfLavaJatoItem, MpfLavaJatoResponseSchema } from '../dtos/MpfLavaJatoDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class MpfLavaJato implements IInfosimplesOperation<MpfLavaJatoItem> {
  readonly path = 'consultas/mpf/lava-jato';
  readonly requiredParams = ['termos'];

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, MpfLavaJatoItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(MpfLavaJatoResponseSchema, result.value);
  }
}
