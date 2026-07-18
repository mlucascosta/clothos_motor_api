/**
 * @fileoverview Executor da fonte `apibrasil_cadastro_pf` — cadastro de pessoa física.
 *
 * Reusa a operation `CpfDados` (POST /cpf-dados) já registrada no catálogo do provider —
 * o guard de `error:true` em HTTP 200 exigido pela ApiBrasil vive no
 * `ApiBrasilHttpClient.request`, então toda operation o herda. Só roda com
 * identifierKind CPF: o CPF chega DECIFRADO no contexto (LaravelPiiResolver) e vive
 * apenas em memória durante a execução.
 *
 * @module infrastructure/providers/apibrasil/ApiBrasilCadastroPfExecutor
 */

import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IApiBrasilOperation } from './ports/IApiBrasilOperation.js';

export class ApiBrasilCadastroPfExecutor implements ISourceExecutor {
  constructor(
    private readonly cadastroPf: IApiBrasilOperation,
    readonly sourceName = 'apibrasil_cadastro_pf',
  ) {}

  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    if (context.identifierKind !== 'CPF') {
      return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'CPF identifier required'));
    }

    const startedAt = Date.now();
    const result = await this.cadastroPf.execute({ cpf: context.identifier });
    if (isLeft(result)) return result;

    return right({
      source: this.sourceName,
      data: { cadastro_pf: result.value },
      cost: 1,
      latency_ms: Date.now() - startedAt,
    });
  }
}
