/**
 * @fileoverview Operation — Portal Transparência / Convênios
 * Endpoint: POST consultas/portal-transparencia/convenios
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaConvenios
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PortalTransparenciaConveniosItem,
  PortalTransparenciaConveniosResponseSchema,
} from '../dtos/PortalTransparenciaConveniosDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaConvenios
  implements IInfosimplesOperation<PortalTransparenciaConveniosItem>
{
  readonly path = 'consultas/portal-transparencia/convenios';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaConveniosItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PortalTransparenciaConveniosResponseSchema, result.value);
  }
}
