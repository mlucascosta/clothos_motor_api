/**
 * @fileoverview Operation — B3 / Participantes
 * Endpoint: POST consultas/b3/participantes
 * @module infrastructure/providers/infosimples/operations/B3Participantes
 */
import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { B3ParticipantesResponseSchema, type B3ParticipantesItem } from '../dtos/B3ParticipantesDto.js';

export class B3Participantes implements IInfosimplesOperation<B3ParticipantesItem> {
  readonly path = 'consultas/b3/participantes';
  readonly requiredParams = ['cnpj'];

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(B3ParticipantesResponseSchema, result.value, 'infosimples');
  }
}
