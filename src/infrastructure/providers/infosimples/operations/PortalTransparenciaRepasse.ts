/**
 * @fileoverview Operation — Portal Transparência / Repasse
 * Endpoint: POST consultas/portal-transparencia/repasse
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaRepasse
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PortalTransparenciaRepasseItem,
  PortalTransparenciaRepasseResponseSchema,
} from '../dtos/PortalTransparenciaRepasseDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaRepasse
  implements IInfosimplesOperation<PortalTransparenciaRepasseItem>
{
  readonly path = 'consultas/portal-transparencia/repasse';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaRepasseItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PortalTransparenciaRepasseResponseSchema, result.value);
  }
}
