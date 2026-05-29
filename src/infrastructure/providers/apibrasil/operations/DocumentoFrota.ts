/**
 * @fileoverview Operation DocumentoFrota — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/DocumentoFrota
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { DocumentoFrotaSchema } from '../dtos/DocumentoFrotaDto.js';
import type { IDocumentoFrota } from '../ports/IDocumentoFrota.js';

export class DocumentoFrota implements IDocumentoFrota {
  readonly path = '/documento-frota';
  readonly creditValue = 2.28;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      body: cleanParams,
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(DocumentoFrotaSchema, result.value, 'apibrasil');
  }
}
