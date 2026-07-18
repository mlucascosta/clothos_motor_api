/**
 * @fileoverview Operation — Certidão de Débitos Federais / Dívida Ativa da União (RFB/PGFN).
 * Aceita `cpf` OU `cnpj` (a certidão conjunta RFB/PGFN existe para ambos).
 * Endpoint: POST consultas/receita-federal/pgfn
 * @module infrastructure/providers/infosimples/operations/PgfnCertidao
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import { type PgfnCertidaoResponse, PgfnCertidaoResponseSchema } from '../dtos/PgfnCertidaoDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PgfnCertidao implements IInfosimplesOperation<PgfnCertidaoResponse> {
  // endpoint a homologar (gate técnico §6) — path no padrão consultas/<órgão>/<serviço>
  readonly path = 'consultas/receita-federal/pgfn';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PgfnCertidaoResponse>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PgfnCertidaoResponseSchema, result.value);
  }
}
