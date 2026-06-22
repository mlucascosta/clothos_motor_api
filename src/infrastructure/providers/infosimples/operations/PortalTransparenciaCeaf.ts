/**
 * @fileoverview Operation — Portal Transparência / CEAF
 * Endpoint: POST consultas/portal-transparencia/ceaf
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaCeaf
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PortalTransparenciaCeafItem,
  PortalTransparenciaCeafResponseSchema,
} from '../dtos/PortalTransparenciaCeafDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaCeaf implements IInfosimplesOperation<PortalTransparenciaCeafItem> {
  readonly path = 'consultas/portal-transparencia/ceaf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaCeafItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PortalTransparenciaCeafResponseSchema, result.value);
  }
}
