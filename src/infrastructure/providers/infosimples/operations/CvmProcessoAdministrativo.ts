/**
 * @fileoverview Operation — CVM / Processo Administrativo
 * Endpoint: POST consultas/cvm/processo-administrativo
 * @module infrastructure/providers/infosimples/operations/CvmProcessoAdministrativo
 */
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { CvmProcessoAdministrativoResponseSchema, type CvmProcessoAdministrativoItem } from '../dtos/CvmProcessoAdministrativoDto.js';

export class CvmProcessoAdministrativo implements IInfosimplesOperation<CvmProcessoAdministrativoItem> {
  readonly path = 'consultas/cvm/processo-administrativo';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(CvmProcessoAdministrativoResponseSchema, result.value, 'infosimples');
  }
}
