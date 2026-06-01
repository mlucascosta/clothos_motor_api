/**
 * @fileoverview Operation TSECertidaodeQuitacaoEleitoral — DirectData Marketplace API.
 * Endpoint para realizar a consulta TSE - Certidão de Quitação Eleitoral. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/TSECertidaodeQuitacaoEleitoral
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { TSECertidaodeQuitacaoEleitoralRetornoSchema } from '../dtos/TSECertidaodeQuitacaoEleitoralDto.js';
import type { ITSECertidaodeQuitacaoEleitoral } from '../ports/ITSECertidaodeQuitacaoEleitoral.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: TSECertidaodeQuitacaoEleitoralRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `TSECertidaodeQuitacaoEleitoral`.
 *
 * @class TSECertidaodeQuitacaoEleitoral
 * @implements {ITSECertidaodeQuitacaoEleitoral}
 */
export class TSECertidaodeQuitacaoEleitoral implements ITSECertidaodeQuitacaoEleitoral {
  readonly path = '/api/TSECertidaodeQuitacaoEleitoral';

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
