/**
 * @fileoverview Operation CARFConselhoAdministrativodeRecursosFiscais — DirectData Marketplace API.
 * Endpoint para realizar a consulta CARF - Conselho Administrativo de Recursos Fiscais. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CARFConselhoAdministrativodeRecursosFiscais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { CARFConselhoAdministrativodeRecursosFiscaisRetornoSchema } from '../dtos/CARFConselhoAdministrativodeRecursosFiscaisDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICARFConselhoAdministrativodeRecursosFiscais } from '../ports/ICARFConselhoAdministrativodeRecursosFiscais.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CARFConselhoAdministrativodeRecursosFiscaisRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CARFConselhoAdministrativodeRecursosFiscais`.
 *
 * @class CARFConselhoAdministrativodeRecursosFiscais
 * @implements {ICARFConselhoAdministrativodeRecursosFiscais}
 */
export class CARFConselhoAdministrativodeRecursosFiscais implements ICARFConselhoAdministrativodeRecursosFiscais {
  readonly path = '/api/CARFConselhoAdministrativodeRecursosFiscais';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, ReturnType<typeof ResponseSchema.parse>>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'GET',
      params: cleanParams,
    });

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'directdata');
  }
}
