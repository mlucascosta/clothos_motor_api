/**
 * @fileoverview Operation — Portal Transparência / Busca
 * Endpoint: POST consultas/portal-transparencia/busca
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaBusca
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PortalTransparenciaBuscaResponse,
  PortalTransparenciaBuscaResponseSchema,
} from '../dtos/PortalTransparenciaBuscaDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaBusca
  implements IInfosimplesOperation<PortalTransparenciaBuscaResponse>
{
  readonly path = 'consultas/portal-transparencia/busca';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaBuscaResponse>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PortalTransparenciaBuscaResponseSchema, result.value);
  }
}
