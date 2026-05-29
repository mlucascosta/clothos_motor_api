/**
 * @fileoverview Operation BoaVistaAcertaCompletoPositivoPF — DirectData Marketplace API.
 * Endpoint para realizar a consulta Boa Vista - Acerta Completo Positivo Pessoa Física.
 * @module infrastructure/providers/directdata/operations/BoaVistaAcertaCompletoPositivoPF
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { BoaVistaAcertaCompletoPositivoPFRetornoSchema } from '../dtos/BoaVistaAcertaCompletoPositivoPFDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IBoaVistaAcertaCompletoPositivoPF } from '../ports/IBoaVistaAcertaCompletoPositivoPF.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: BoaVistaAcertaCompletoPositivoPFRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `BoaVistaAcertaCompletoPositivoPF`.
 *
 * @class BoaVistaAcertaCompletoPositivoPF
 * @implements {IBoaVistaAcertaCompletoPositivoPF}
 */
export class BoaVistaAcertaCompletoPositivoPF implements IBoaVistaAcertaCompletoPositivoPF {
  readonly path = '/api/BoaVistaAcertaCompletoPositivoPF';

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
