/**
 * @fileoverview Operation CADINSecretariaFazendaEstaduais — DirectData Marketplace API.
 * Endpoint para realizar a consulta CADIN - Secretaria da Fazenda .
 * @module infrastructure/providers/directdata/operations/CADINSecretariaFazendaEstaduais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { CADINSecretariaFazendaEstaduaisRetornoSchema } from '../dtos/CADINSecretariaFazendaEstaduaisDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICADINSecretariaFazendaEstaduais } from '../ports/ICADINSecretariaFazendaEstaduais.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CADINSecretariaFazendaEstaduaisRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CADINSecretariaFazendaEstaduais`.
 *
 * @class CADINSecretariaFazendaEstaduais
 * @implements {ICADINSecretariaFazendaEstaduais}
 */
export class CADINSecretariaFazendaEstaduais implements ICADINSecretariaFazendaEstaduais {
  readonly path = '/api/CADINSecretariaFazendaEstaduais';

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
