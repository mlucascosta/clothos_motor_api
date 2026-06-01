/**
 * @fileoverview Operation CadastroEntidadesPrivadasImpedidas — DirectData Marketplace API.
 * Endpoint para realizar a consulta CEPIM - Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroEntidadesPrivadasImpedidas
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { CadastroEntidadesPrivadasImpedidasRetornoSchema } from '../dtos/CadastroEntidadesPrivadasImpedidasDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICadastroEntidadesPrivadasImpedidas } from '../ports/ICadastroEntidadesPrivadasImpedidas.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CadastroEntidadesPrivadasImpedidasRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CadastroEntidadesPrivadasImpedidas`.
 *
 * @class CadastroEntidadesPrivadasImpedidas
 * @implements {ICadastroEntidadesPrivadasImpedidas}
 */
export class CadastroEntidadesPrivadasImpedidas implements ICadastroEntidadesPrivadasImpedidas {
  readonly path = '/api/CadastroEntidadesPrivadasImpedidas';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ReturnType<typeof ResponseSchema.parse>>> {
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

    if (isLeft(result)) return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'directdata');
  }
}
