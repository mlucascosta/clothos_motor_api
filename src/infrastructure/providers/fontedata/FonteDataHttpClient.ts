/**
 * @fileoverview Cliente HTTP da Fonte Data (docs/sources/FONTEDATA-IMPLEMENTACAO.md).
 *
 * REST `GET /consulta/<slug>` com auth por header `X-API-Key`. O contrato COMERCIAL vive
 * nos headers da resposta: `X-Request-Cost` é o custo REAL em BRL debitado da conta
 * pré-paga — capturado aqui e convertido para CENTAVOS (RB-03/RB-05), nunca placeholder.
 *
 * Erros por status HTTP (mapeados pelo FetchHttpClient): 401 AUTH_FAILED, 402/5xx
 * UPSTREAM_ERROR, 404 NOT_FOUND (ausência válida — decidida no executor), 429 RATE_LIMITED.
 *
 * @module infrastructure/providers/fontedata/FonteDataHttpClient
 */

import { type Either, isLeft, right } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { FetchHttpClient } from '@shared/infrastructure/FetchHttpClient.js';

const FONTEDATA_BASE_URL = 'https://app.fontedata.com/api/v1';

export interface FonteDataResponse<T> {
  readonly body: T;
  /** Custo REAL em centavos, medido do header `X-Request-Cost` (BRL). 0 quando ausente. */
  readonly costCents: number;
  /** Saldo restante em centavos (`X-Balance-Remaining`), quando informado. */
  readonly balanceRemainingCents?: number;
}

export class FonteDataHttpClient {
  private readonly http: FetchHttpClient;

  constructor(apiKey: string, baseUrl: string = FONTEDATA_BASE_URL) {
    this.http = new FetchHttpClient({
      baseUrl,
      sourceName: 'fontedata',
      defaultHeaders: { Accept: 'application/json', 'X-API-Key': apiKey },
      defaultTimeoutMs: 30_000,
    });
  }

  /** GET /consulta/<slug>?<params>, capturando o custo real do header. */
  async query<T>(
    slug: string,
    params: Record<string, string>,
  ): Promise<Either<SourceError, FonteDataResponse<T>>> {
    const res = await this.http.requestWithHeaders<T>(`/consulta/${slug}`, { params });
    if (isLeft(res)) {
      return res;
    }

    const { body, headers } = res.value;
    const balance = parseBrlCents(headers['x-balance-remaining']);

    return right({
      body,
      costCents: parseBrlCents(headers['x-request-cost']) ?? 0,
      ...(balance === undefined ? {} : { balanceRemainingCents: balance }),
    });
  }
}

/** `"1.99"` (BRL) -> 199 centavos. Header ausente/não-numérico -> undefined. */
function parseBrlCents(raw: string | undefined): number | undefined {
  if (raw === undefined || raw.trim() === '') {
    return undefined;
  }
  const value = Number.parseFloat(raw.replace(',', '.'));
  if (!Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return Math.round(value * 100);
}
