/**
 * @fileoverview Operation — Portal Transparência / Seguro Defeso
 * Endpoint: POST consultas/portal-transparencia/seguro
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaSeguro
 */
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { PortalTransparenciaSeguroResponseSchema, type PortalTransparenciaSeguroItem } from '../dtos/PortalTransparenciaSeguroDto.js';

export class PortalTransparenciaSeguro implements IInfosimplesOperation<PortalTransparenciaSeguroItem> {
  readonly path = 'consultas/portal-transparencia/seguro';
  readonly requiredParams = undefined;

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(PortalTransparenciaSeguroResponseSchema, result.value, 'infosimples');
  }
}
