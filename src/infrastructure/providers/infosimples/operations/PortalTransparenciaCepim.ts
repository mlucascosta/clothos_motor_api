/**
 * @fileoverview Operation — Portal Transparência / CEPIM
 * Endpoint: POST consultas/portal-transparencia/cepim
 * @module infrastructure/providers/infosimples/operations/PortalTransparenciaCepim
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type PortalTransparenciaCepimItem,
  PortalTransparenciaCepimResponseSchema,
} from '../dtos/PortalTransparenciaCepimDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PortalTransparenciaCepim
  implements IInfosimplesOperation<PortalTransparenciaCepimItem>
{
  readonly path = 'consultas/portal-transparencia/cepim';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PortalTransparenciaCepimItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(PortalTransparenciaCepimResponseSchema, result.value, 'infosimples');
  }
}
