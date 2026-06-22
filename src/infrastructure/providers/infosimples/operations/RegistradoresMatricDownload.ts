/**
 * @fileoverview Operation — Registradores / Matrícula Download
 * Endpoint: POST consultas/registradores/matric/download
 * @module infrastructure/providers/infosimples/operations/RegistradoresMatricDownload
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type RegistradoresMatricDownloadItem,
  RegistradoresMatricDownloadResponseSchema,
} from '../dtos/RegistradoresMatricDownloadDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class RegistradoresMatricDownload
  implements IInfosimplesOperation<RegistradoresMatricDownloadItem>
{
  readonly path = 'consultas/registradores/matric/download';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RegistradoresMatricDownloadItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(RegistradoresMatricDownloadResponseSchema, result.value);
  }
}
