/**
 * @fileoverview Operation — Portal Transparência / Bolsa Família
 * Endpoint: POST consultas/portal-transparencia/bolsa
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaBolsa
 */
import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { PortalTransparenciaBolsaResponseSchema, type PortalTransparenciaBolsaItem } from '../dtos/PortalTransparenciaBolsaDto.js';

export class PortalTransparenciaBolsa implements IInfosimplesOperation<PortalTransparenciaBolsaItem> {
  readonly path = 'consultas/portal-transparencia/bolsa';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(PortalTransparenciaBolsaResponseSchema, result.value, 'infosimples');
  }
}
