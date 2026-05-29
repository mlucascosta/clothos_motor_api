/**
 * @fileoverview Operation — Registradores / Certidão Download
 * Endpoint: POST consultas/registradores/certid/download
 * @module infrastructure/providers/infosimples/operations/RegistradoresCertidDownload
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { RegistradoresCertidDownloadResponseSchema, type RegistradoresCertidDownloadItem } from '../dtos/RegistradoresCertidDownloadDto.js';

export class RegistradoresCertidDownload implements IInfosimplesOperation<RegistradoresCertidDownloadItem> {
  readonly path = 'consultas/registradores/certid/download';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, RegistradoresCertidDownloadItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(RegistradoresCertidDownloadResponseSchema, result.value, 'infosimples');
  }
}
