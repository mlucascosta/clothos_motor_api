/**
 * @fileoverview Operation ANTTConsultaRegularidadeTransportadora — DirectData Marketplace API.
 * Endpoint para realizar a consulta ANTT - Consulta de Regularidade da Transportadora.
 * @module infrastructure/providers/directdata/operations/ANTTConsultaRegularidadeTransportadora
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { ANTTConsultaRegularidadeTransportadoraRetornoSchema } from '../dtos/ANTTConsultaRegularidadeTransportadoraDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IANTTConsultaRegularidadeTransportadora } from '../ports/IANTTConsultaRegularidadeTransportadora.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: ANTTConsultaRegularidadeTransportadoraRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `ANTTConsultaRegularidadeTransportadora`.
 *
 * @class ANTTConsultaRegularidadeTransportadora
 * @implements {IANTTConsultaRegularidadeTransportadora}
 */
export class ANTTConsultaRegularidadeTransportadora implements IANTTConsultaRegularidadeTransportadora {
  readonly path = '/api/ANTTConsultaRegularidadeTransportadora';

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
