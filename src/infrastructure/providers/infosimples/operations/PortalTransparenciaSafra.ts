/**
 * @fileoverview Operation — Portal Transparência / Garantia Safra
 * Endpoint: POST consultas/portal-transparencia/safra
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaSafra
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { PortalTransparenciaSafraResponseSchema, type PortalTransparenciaSafraItem } from '../dtos/PortalTransparenciaSafraDto.js';

export class PortalTransparenciaSafra implements IInfosimplesOperation<PortalTransparenciaSafraItem> {
  readonly path = 'consultas/portal-transparencia/safra';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(PortalTransparenciaSafraResponseSchema, result.value, 'infosimples');
  }
}
