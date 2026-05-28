/**
 * @fileoverview Operation TCUConsultaConsolidadaPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta TCU - Consulta Consolidada de Pessoa Jurídica - APF.
 * @module infrastructure/providers/directdata/operations/TCUConsultaConsolidadaPessoaJuridica
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { TCUConsultaConsolidadaPessoaJuridicaRetornoSchema } from '../dtos/TCUConsultaConsolidadaPessoaJuridicaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ITCUConsultaConsolidadaPessoaJuridica } from '../ports/ITCUConsultaConsolidadaPessoaJuridica.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: TCUConsultaConsolidadaPessoaJuridicaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `TCUConsultaConsolidadaPessoaJuridica`.
 *
 * @class TCUConsultaConsolidadaPessoaJuridica
 * @implements {ITCUConsultaConsolidadaPessoaJuridica}
 */
export class TCUConsultaConsolidadaPessoaJuridica implements ITCUConsultaConsolidadaPessoaJuridica {
  readonly path = '/api/TCUConsultaConsolidadaPessoaJuridica';

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
