/**
 * @fileoverview Operation — Portal Transparência / Garantia Safra
 * Endpoint: POST consultas/portal-transparencia/safra
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaSafra
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PortalTransparenciaSafraResponse,
  PortalTransparenciaSafraResponseSchema,
} from '../dtos/PortalTransparenciaSafraDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaSafra
  implements IInfosimplesOperation<PortalTransparenciaSafraResponse>
{
  readonly path = 'consultas/portal-transparencia/safra';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaSafraResponse>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PortalTransparenciaSafraResponseSchema, result.value);
  }
}
