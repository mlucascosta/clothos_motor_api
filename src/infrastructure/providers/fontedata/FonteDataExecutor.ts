/**
 * @fileoverview Executor Fonte Data — uma instância por fonte interna `fontedata_*`.
 *
 * Diferenciais do provider (doc §1): custo é MEDIDO (`X-Request-Cost` → centavos em
 * `SourceResult.costCents`, RB-03), não placeholder; erro × ausência vêm por status HTTP
 * limpo. `NOT_FOUND` (404) é AUSÊNCIA VÁLIDA: consultou e não há registro — vira sucesso
 * com `encontrado:false` (consome conforme a política do produto). 401/402/429/5xx/timeout
 * são falha técnica (não consome).
 *
 * @module infrastructure/providers/fontedata/FonteDataExecutor
 */

import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { FonteDataQuery } from './operations/FonteDataQuery.js';

export class FonteDataExecutor implements ISourceExecutor {
  constructor(
    private readonly operation: FonteDataQuery<Record<string, unknown>>,
    readonly sourceName: string,
    /** Traduz o contexto nos parâmetros do endpoint; null = identificador incompatível. */
    private readonly paramsFor: (context: SourceContext) => Record<string, string> | null,
  ) {}

  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    const params = this.paramsFor(context);
    if (params === null) {
      return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'identificador incompatível'));
    }

    const started = Date.now();
    const outcome = await this.operation.execute(params);

    if (isLeft(outcome)) {
      // 404 = ausência válida: a consulta EXECUTOU e o registro não existe. Não é falha —
      // e a política comercial ("ausência válida consome") é decidida no settle do Laravel.
      if (outcome.value.kind === 'NOT_FOUND') {
        return right({
          source: this.sourceName,
          data: { encontrado: false },
          cost: 1,
          costCents: 0,
          latency_ms: Date.now() - started,
        });
      }

      return outcome;
    }

    return right({
      source: this.sourceName,
      data: outcome.value.body,
      cost: 1,
      // Custo REAL debitado (X-Request-Cost), em centavos — alimenta o ledger de COGS
      // (RB-03) em vez do placeholder do catálogo.
      costCents: outcome.value.costCents,
      latency_ms: Date.now() - started,
    });
  }
}
