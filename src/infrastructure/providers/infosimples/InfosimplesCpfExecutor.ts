/**
 * @fileoverview Executor da fonte `infosimples_cpf` — Receita Federal CPF via Infosimples.
 *
 * Só roda com identifierKind CPF: o CPF chega DECIFRADO no contexto (LaravelPiiResolver);
 * sem resolver, o processor nem despacha a fonte — o CPF em claro vive apenas em memória.
 * O endpoint da Receita exige `birthdate`: quando o job carrega subject_profile, o slug
 * canônico `birthdate` é repassado como parâmetro; sem ele, a chamada segue apenas com o
 * CPF e a Infosimples responde `invalid_parameters` (vira Left, nunca sucesso fantasma).
 *
 * @module infrastructure/providers/infosimples/InfosimplesCpfExecutor
 */

import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IInfosimplesOperation } from './ports/IInfosimplesOperation.js';

export class InfosimplesCpfExecutor implements ISourceExecutor {
  constructor(
    private readonly operation: IInfosimplesOperation,
    readonly sourceName = 'infosimples_cpf',
  ) {}

  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    if (context.identifierKind !== 'CPF') {
      return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'CPF identifier required'));
    }

    const startedAt = Date.now();
    const birthdate = context.subjectProfile?.['birthdate'];
    const result = await this.operation.execute({
      cpf: context.identifier,
      ...(birthdate === undefined ? {} : { birthdate }),
    });
    if (isLeft(result)) return result;

    return right({
      source: this.sourceName,
      data: { cpf: result.value as Record<string, unknown> },
      cost: 1,
      latency_ms: Date.now() - startedAt,
    });
  }
}
