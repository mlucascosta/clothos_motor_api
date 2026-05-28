/**
 * @fileoverview Operation CadastroAmbientalRural — DirectData Marketplace API.
 * Endpoint para realizar a consulta CAR - Cadastro Ambiental Rural.
 * @module infrastructure/providers/directdata/operations/CadastroAmbientalRural
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { CadastroAmbientalRuralRetornoSchema } from '../dtos/CadastroAmbientalRuralDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICadastroAmbientalRural } from '../ports/ICadastroAmbientalRural.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CadastroAmbientalRuralRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CadastroAmbientalRural`.
 *
 * @class CadastroAmbientalRural
 * @implements {ICadastroAmbientalRural}
 */
export class CadastroAmbientalRural implements ICadastroAmbientalRural {
  readonly path = '/api/CadastroAmbientalRural';

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
