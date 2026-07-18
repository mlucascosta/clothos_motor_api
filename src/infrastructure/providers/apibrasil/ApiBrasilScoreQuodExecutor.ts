/**
 * @fileoverview Executor da fonte `apibrasil_score_quod` — Score de crédito QUOD.
 *
 * Reusa a operation `ScoreCreditoQuod` (POST /score-credito-quod) do catálogo do
 * provider; o guard de `error:true` em HTTP 200 exigido pela ApiBrasil vive no
 * `ApiBrasilHttpClient.request`. Dispatch por identifierKind: CPF envia `{cpf}`,
 * CNPJ envia `{cnpj}` no body do mesmo endpoint.
 * // parâmetro cnpj a homologar (gate técnico §6) — o SDK oficial documenta `cpf`;
 * // a variante PJ segue o mesmo endpoint até a homologação real confirmar.
 *
 * @module infrastructure/providers/apibrasil/ApiBrasilScoreQuodExecutor
 */

import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IApiBrasilOperation } from './ports/IApiBrasilOperation.js';

export class ApiBrasilScoreQuodExecutor implements ISourceExecutor {
  constructor(
    private readonly scoreQuod: IApiBrasilOperation,
    readonly sourceName = 'apibrasil_score_quod',
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
    const result = await this.scoreQuod.execute(params);
    if (isLeft(result)) return result;

    return right({
      source: this.sourceName,
      data: { score_quod: result.value },
      cost: 1,
      latency_ms: Date.now() - startedAt,
    });
  }
}
