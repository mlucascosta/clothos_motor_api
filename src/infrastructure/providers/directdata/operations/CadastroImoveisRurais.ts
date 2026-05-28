/**
 * @fileoverview Operation CadastroImoveisRurais — DirectData Marketplace API.
 * Endpoint para realizar a consulta CAFIR - Cadastros de Imóveis Rurais.
 * @module infrastructure/providers/directdata/operations/CadastroImoveisRurais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { CadastroImoveisRuraisRetornoSchema } from '../dtos/CadastroImoveisRuraisDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICadastroImoveisRurais } from '../ports/ICadastroImoveisRurais.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CadastroImoveisRuraisRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CadastroImoveisRurais`.
 *
 * @class CadastroImoveisRurais
 * @implements {ICadastroImoveisRurais}
 */
export class CadastroImoveisRurais implements ICadastroImoveisRurais {
  readonly path = '/api/CadastroImoveisRurais';

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
