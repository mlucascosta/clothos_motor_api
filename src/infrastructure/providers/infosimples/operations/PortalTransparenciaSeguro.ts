/**
 * @fileoverview Operation — Portal Transparência / Seguro Defeso
 * Endpoint: POST consultas/portal-transparencia/seguro
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaSeguro
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type PortalTransparenciaSeguroResponse,
  PortalTransparenciaSeguroResponseSchema,
} from '../dtos/PortalTransparenciaSeguroDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaSeguro
  implements IInfosimplesOperation<PortalTransparenciaSeguroResponse>
{
  readonly path = 'consultas/portal-transparencia/seguro';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaSeguroResponse>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(PortalTransparenciaSeguroResponseSchema, result.value, 'infosimples');
  }
}
