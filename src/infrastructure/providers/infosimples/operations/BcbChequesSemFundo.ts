/**
 * @fileoverview Operation — BCB / Cheques Sem Fundo
 * Endpoint: POST consultas/bcb/cheques-sem-fundo
 * @module infrastructure/providers/infosimples/operations/BcbChequesSemFundo
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { BcbChequesSemFundoResponseSchema, type BcbChequesSemFundoItem } from '../dtos/BcbChequesSemFundoDto.js';

export class BcbChequesSemFundo implements IInfosimplesOperation<BcbChequesSemFundoItem> {
  readonly path = 'consultas/bcb/cheques-sem-fundo';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(BcbChequesSemFundoResponseSchema, result.value, 'infosimples');
  }
}
