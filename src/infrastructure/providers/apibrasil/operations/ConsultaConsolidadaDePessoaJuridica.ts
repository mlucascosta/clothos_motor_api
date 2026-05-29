/**
 * @fileoverview Operation ConsultaConsolidadaDePessoaJuridica — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ConsultaConsolidadaDePessoaJuridica
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { ConsultaConsolidadaDePessoaJuridicaSchema } from '../dtos/ConsultaConsolidadaDePessoaJuridicaDto.js';
import type { ConsultaConsolidadaDePessoaJuridicaDto } from '../dtos/ConsultaConsolidadaDePessoaJuridicaDto.js';
import type { IConsultaConsolidadaDePessoaJuridica } from '../ports/IConsultaConsolidadaDePessoaJuridica.js';

export class ConsultaConsolidadaDePessoaJuridica implements IConsultaConsolidadaDePessoaJuridica {
  readonly path = '/consulta-consolidada-pj';
  readonly creditValue = 3.6;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ConsultaConsolidadaDePessoaJuridicaDto>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      body: cleanParams,
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(ConsultaConsolidadaDePessoaJuridicaSchema, result.value, 'apibrasil');
  }
}
