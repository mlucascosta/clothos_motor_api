/**
 * @fileoverview Operation — Portal Transparência / Acordos de Leniência
 * Endpoint: POST consultas/portal-transparencia/leniencia
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaLeniencia
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PortalTransparenciaLenienciaItem,
  PortalTransparenciaLenienciaResponseSchema,
} from '../dtos/PortalTransparenciaLenienciaDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaLeniencia
  implements IInfosimplesOperation<PortalTransparenciaLenienciaItem>
{
  readonly path = 'consultas/portal-transparencia/leniencia';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaLenienciaItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PortalTransparenciaLenienciaResponseSchema, result.value);
  }
}
