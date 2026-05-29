/**
 * @fileoverview Operation — Antecedentes Criminais / PF Emissão
 * Endpoint: POST consultas/antecedentes-criminais/pf/emit
 * @module infrastructure/providers/infosimples/operations/AntecedenteCriminaisPfEmit
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { AntecedenteCriminaisPfEmitResponseSchema, type AntecedenteCriminaisPfEmitItem } from '../dtos/AntecedenteCriminaisPfEmitDto.js';

export class AntecedenteCriminaisPfEmit implements IInfosimplesOperation<AntecedenteCriminaisPfEmitItem> {
  readonly path = 'consultas/antecedentes-criminais/pf/emit';
  readonly requiredParams = ['nome', 'birthdate'];

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, AntecedenteCriminaisPfEmitItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(AntecedenteCriminaisPfEmitResponseSchema, result.value, 'infosimples');
  }
}
