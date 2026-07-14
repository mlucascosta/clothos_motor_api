/**
 * @fileoverview Executor DirectData de operação única por CNPJ.
 * Diferente do DirectDataExecutor (multiplexa por identifierKind), este vincula UMA
 * operação a UMA fonte — padrão análogo ao InfosimplesExecutor. Permite expor várias
 * fontes DirectData baseadas em CNPJ (ex.: `directdata_qsa`, `directdata_processos`),
 * que o dispatch por identifierKind não conseguiria distinguir.
 * @module infrastructure/providers/directdata/DirectDataCnpjExecutor
 */

import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IDirectDataOperation } from './ports/IDirectDataOperation.js';

/**
 * Executa uma operação DirectData específica usando o CNPJ do contexto como parâmetro.
 */
export class DirectDataCnpjExecutor implements ISourceExecutor {
  constructor(
    private readonly operation: IDirectDataOperation<unknown>,
    readonly sourceName: string,
  ) {}

  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    if (context.identifierKind !== 'CNPJ') {
      return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'CNPJ identifier required'));
    }

    const startedAt = Date.now();
    const result = await this.operation.execute({ CNPJ: context.identifier });
    if (isLeft(result)) return result;

    const { metaDados, retorno } = result.value;
    return right({
      source: this.sourceName,
      data: { metaDados, retorno: retorno ?? null },
      cost: 1,
      latency_ms: Date.now() - startedAt,
    });
  }
}
