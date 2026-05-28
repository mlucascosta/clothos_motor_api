/**
 * @fileoverview Operation — Portal Transparência / CEPIM
 * Endpoint: POST consultas/portal-transparencia/cepim
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaCepim
 */
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { PortalTransparenciaCepimResponseSchema, type PortalTransparenciaCepimItem } from '../dtos/PortalTransparenciaCepimDto.js';

export class PortalTransparenciaCepim implements IInfosimplesOperation<PortalTransparenciaCepimItem> {
  readonly path = 'consultas/portal-transparencia/cepim';
  readonly requiredParams = undefined;

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(PortalTransparenciaCepimResponseSchema, result.value, 'infosimples');
  }
}
