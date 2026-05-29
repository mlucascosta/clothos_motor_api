/**
 * @fileoverview Operation IbamaCertificadoRegularidade — Infosimples API.
 * Endpoint: POST consultas/ibama/certificado-regularidade
 * @module infrastructure/providers/infosimples/operations/IbamaCertificadoRegularidade
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { IbamaCertificadoRegularidadeResponseSchema, type IbamaCertificadoRegularidadeItem } from '../dtos/IbamaCertificadoRegularidadeDto.js';

export class IbamaCertificadoRegularidade implements IInfosimplesOperation<IbamaCertificadoRegularidadeItem> {
  readonly path = 'consultas/ibama/certificado-regularidade';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, IbamaCertificadoRegularidadeItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(IbamaCertificadoRegularidadeResponseSchema, result.value, 'infosimples');
  }
}
