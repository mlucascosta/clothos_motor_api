/**
 * @fileoverview Operation NotaFiscalEletronicaInutilizacao — DirectData Marketplace API.
 * Endpoint para realizar a consulta NFe - Nota Fiscal Eletrônica - Inutilizações.
 * @module infrastructure/providers/directdata/operations/NotaFiscalEletronicaInutilizacao
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { NotaFiscalEletronicaInutilizacaoRetornoSchema } from '../dtos/NotaFiscalEletronicaInutilizacaoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { INotaFiscalEletronicaInutilizacao } from '../ports/INotaFiscalEletronicaInutilizacao.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: NotaFiscalEletronicaInutilizacaoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `NotaFiscalEletronicaInutilizacao`.
 *
 * @class NotaFiscalEletronicaInutilizacao
 * @implements {INotaFiscalEletronicaInutilizacao}
 */
export class NotaFiscalEletronicaInutilizacao implements INotaFiscalEletronicaInutilizacao {
  readonly path = '/api/NotaFiscalEletronicaInutilizacao';

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
