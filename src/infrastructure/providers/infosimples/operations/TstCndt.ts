/**
 * @fileoverview Operation — Certidão Negativa de Débitos Trabalhistas (TST / CNDT).
 * Aceita `cpf` OU `cnpj`.
 * Endpoint: POST consultas/tst/cndt
 * @module infrastructure/providers/infosimples/operations/TstCndt
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import { type TstCndtResponse, TstCndtResponseSchema } from '../dtos/TstCndtDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class TstCndt implements IInfosimplesOperation<TstCndtResponse> {
  // endpoint a homologar (gate técnico §6) — path no padrão consultas/<órgão>/<serviço>
  readonly path = 'consultas/tst/cndt';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, TstCndtResponse>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(TstCndtResponseSchema, result.value);
  }
}
