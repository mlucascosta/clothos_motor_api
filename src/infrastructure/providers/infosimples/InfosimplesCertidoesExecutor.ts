/**
 * @fileoverview Executor da fonte `infosimples_certidoes` — agregado PGFN + TST (CNDT).
 *
 * A fonte comercial `infosimples_certidoes` cobre duas certidões em uma execução:
 * a CND federal RFB/PGFN e a CNDT do TST. O padrão do provider é 1 operation por
 * endpoint, então o executor dispara as duas chamadas em paralelo e combina os
 * resultados num único `SourceResult.data` com uma chave por certidão
 * (`{ pgfn, cndt }`). Qualquer falha em uma das certidões falha a fonte inteira
 * (Left) — resultado parcial nunca vira sucesso, evitando settle ambíguo.
 *
 * Aceita CPF e CNPJ (ambas as certidões existem para PF e PJ).
 *
 * @module infrastructure/providers/infosimples/InfosimplesCertidoesExecutor
 */

import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IInfosimplesOperation } from './ports/IInfosimplesOperation.js';

export class InfosimplesCertidoesExecutor implements ISourceExecutor {
  constructor(
    private readonly pgfn: IInfosimplesOperation,
    private readonly cndt: IInfosimplesOperation,
    readonly sourceName = 'infosimples_certidoes',
  ) {}

  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    if (context.identifierKind !== 'CPF' && context.identifierKind !== 'CNPJ') {
      return left(
        new SourceError('UPSTREAM_ERROR', this.sourceName, 'CPF or CNPJ identifier required'),
      );
    }

    const params =
      context.identifierKind === 'CPF' ? { cpf: context.identifier } : { cnpj: context.identifier };

    const startedAt = Date.now();
    const [pgfnResult, cndtResult] = await Promise.all([
      this.pgfn.execute(params),
      this.cndt.execute(params),
    ]);
    if (isLeft(pgfnResult)) return pgfnResult;
    if (isLeft(cndtResult)) return cndtResult;

    return right({
      source: this.sourceName,
      data: {
        pgfn: pgfnResult.value as Record<string, unknown>,
        cndt: cndtResult.value as Record<string, unknown>,
      },
      cost: 1,
      latency_ms: Date.now() - startedAt,
    });
  }
}
