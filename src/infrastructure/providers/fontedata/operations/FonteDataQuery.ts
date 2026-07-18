/**
 * @fileoverview Operação genérica da Fonte Data — 1 instância por slug de endpoint.
 *
 * São 118 endpoints GET homogêneos (mesma auth, querystring simples): uma operação
 * parametrizada por slug substitui o boilerplate 1-arquivo-por-endpoint (doc §2.2).
 * Cada fonte passa um schema Zod (RB-13): payload que não adere ao contrato vira
 * SCHEMA_MISMATCH — nunca sucesso silencioso. Enquanto o contrato real do endpoint não
 * for homologado (gate técnico §6), usa-se um schema estrutural mínimo.
 *
 * @module infrastructure/providers/fontedata/operations/FonteDataQuery
 */

import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ZodType } from 'zod';
import type { FonteDataHttpClient, FonteDataResponse } from '../FonteDataHttpClient.js';

export class FonteDataQuery<T> {
  constructor(
    private readonly http: FonteDataHttpClient,
    private readonly slug: string,
    private readonly schema: ZodType<T>,
  ) {}

  async execute(
    params: Record<string, string>,
  ): Promise<Either<SourceError, FonteDataResponse<T>>> {
    const res = await this.http.query<unknown>(this.slug, params);
    if (isLeft(res)) {
      return res;
    }

    const parsed = this.schema.safeParse(res.value.body);
    if (!parsed.success) {
      // 4º caso obrigatório (RB-13): payload inesperado é ERRO, não sucesso.
      return left(
        new SourceError('SCHEMA_MISMATCH', 'fontedata', `payload inesperado em ${this.slug}`),
      );
    }

    return right({ ...res.value, body: parsed.data });
  }
}
