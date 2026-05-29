/**
 * @fileoverview Operation CVMComissaodeValoresMobiliarios — DirectData Marketplace API.
 * Endpoint para realizar a consulta CVM - Comissão de Valores Mobiliários. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CVMComissaodeValoresMobiliarios
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CVMComissaodeValoresMobiliariosRetornoSchema } from '../dtos/CVMComissaodeValoresMobiliariosDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICVMComissaodeValoresMobiliarios } from '../ports/ICVMComissaodeValoresMobiliarios.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CVMComissaodeValoresMobiliariosRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CVMComissaodeValoresMobiliarios`.
 *
 * @class CVMComissaodeValoresMobiliarios
 * @implements {ICVMComissaodeValoresMobiliarios}
 */
export class CVMComissaodeValoresMobiliarios implements ICVMComissaodeValoresMobiliarios {
  readonly path = '/api/CVMComissaodeValoresMobiliarios';

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
