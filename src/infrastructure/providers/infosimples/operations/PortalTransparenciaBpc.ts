/**
 * @fileoverview Operation — Portal Transparência / BPC
 * Endpoint: POST consultas/portal-transparencia/bpc
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaBpc
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PortalTransparenciaBpcItem,
  PortalTransparenciaBpcResponseSchema,
} from '../dtos/PortalTransparenciaBpcDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaBpc implements IInfosimplesOperation<PortalTransparenciaBpcItem> {
  readonly path = 'consultas/portal-transparencia/bpc';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaBpcItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PortalTransparenciaBpcResponseSchema, result.value);
  }
}
