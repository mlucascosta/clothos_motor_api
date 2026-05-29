/**
 * @fileoverview Operation FgtsGuia — Infosimples API.
 * Endpoint: POST consultas/fgts/guia
 * @module infrastructure/providers/infosimples/operations/FgtsGuia
 */
import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { FgtsGuiaResponseSchema, type FgtsGuiaItem } from '../dtos/FgtsGuiaDto.js';

export class FgtsGuia implements IInfosimplesOperation<FgtsGuiaItem> {
  readonly path = 'consultas/fgts/guia';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(FgtsGuiaResponseSchema, result.value, 'infosimples');
  }
}
