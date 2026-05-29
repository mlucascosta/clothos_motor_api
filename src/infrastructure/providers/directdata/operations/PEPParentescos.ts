/**
 * @fileoverview Operation PEPParentescos — DirectData Marketplace API.
 * Endpoint para realizar a consulta PEP Estendida - Pessoa Exposta Politicamente + Parentescos. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/PEPParentescos
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { PEPParentescosRetornoSchema } from '../dtos/PEPParentescosDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IPEPParentescos } from '../ports/IPEPParentescos.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: PEPParentescosRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `PEPParentescos`.
 *
 * @class PEPParentescos
 * @implements {IPEPParentescos}
 */
export class PEPParentescos implements IPEPParentescos {
  readonly path = '/api/PEPParentescos';

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

    if (isLeft(result)) return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'directdata');
  }
}
