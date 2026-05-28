/**
 * @fileoverview Operation EnriquecimentoLead — DirectData Marketplace API.
 * Endpoint para realizar a consulta Enriquecimento de Lead. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/EnriquecimentoLead
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { EnriquecimentoLeadRetornoSchema } from '../dtos/EnriquecimentoLeadDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IEnriquecimentoLead } from '../ports/IEnriquecimentoLead.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: EnriquecimentoLeadRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `EnriquecimentoLead`.
 *
 * @class EnriquecimentoLead
 * @implements {IEnriquecimentoLead}
 */
export class EnriquecimentoLead implements IEnriquecimentoLead {
  readonly path = '/api/EnriquecimentoLead';

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
