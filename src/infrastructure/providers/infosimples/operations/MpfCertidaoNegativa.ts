/**
 * @fileoverview Operation — MPF / Certidão Negativa
 * Endpoint: POST consultas/mpf/certidao-negativa
 * @module infrastructure/providers/infosimples/operations/MpfCertidaoNegativa
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { MpfCertidaoNegativaResponseSchema, type MpfCertidaoNegativaItem } from '../dtos/MpfCertidaoNegativaDto.js';

export class MpfCertidaoNegativa implements IInfosimplesOperation<MpfCertidaoNegativaItem> {
  readonly path = 'consultas/mpf/certidao-negativa';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(MpfCertidaoNegativaResponseSchema, result.value, 'infosimples');
  }
}
