/**
 * @fileoverview Operation — Portal Transparência / CNEP
 * Endpoint: POST consultas/portal-transparencia/cnep
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaCnep
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PortalTransparenciaCnepItem,
  PortalTransparenciaCnepResponseSchema,
} from '../dtos/PortalTransparenciaCnepDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaCnep implements IInfosimplesOperation<PortalTransparenciaCnepItem> {
  readonly path = 'consultas/portal-transparencia/cnep';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaCnepItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PortalTransparenciaCnepResponseSchema, result.value);
  }
}
