/**
 * @fileoverview Operation — MPF / Processos
 * Endpoint: POST consultas/mpf/processos
 * @module infrastructure/providers/infosimples/operations/MpfProcessos
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { MpfProcessosResponseSchema, type MpfProcessosItem } from '../dtos/MpfProcessosDto.js';

export class MpfProcessos implements IInfosimplesOperation<MpfProcessosItem> {
  readonly path = 'consultas/mpf/processos';
  readonly requiredParams = ['query'];

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(MpfProcessosResponseSchema, result.value, 'infosimples');
  }
}
