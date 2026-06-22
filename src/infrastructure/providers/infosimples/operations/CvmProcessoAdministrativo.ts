/**
 * @fileoverview Operation — CVM / Processo Administrativo
 * Endpoint: POST consultas/cvm/processo-administrativo
 * @module infrastructure/providers/infosimples/operations/CvmProcessoAdministrativo
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type CvmProcessoAdministrativoItem,
  CvmProcessoAdministrativoResponseSchema,
} from '../dtos/CvmProcessoAdministrativoDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class CvmProcessoAdministrativo
  implements IInfosimplesOperation<CvmProcessoAdministrativoItem>
{
  readonly path = 'consultas/cvm/processo-administrativo';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CvmProcessoAdministrativoItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(CvmProcessoAdministrativoResponseSchema, result.value);
  }
}
