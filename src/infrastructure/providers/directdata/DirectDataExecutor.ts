/**
 * @fileoverview Executor de consultas DirectData implementando ISourceExecutor.
 * Despacha para as operações corretas baseado no tipo de identificador (CPF/CNPJ/PROCESSO).
 * @module infrastructure/providers/directdata/DirectDataExecutor
 */

import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import type { Either } from '@shared/domain/Either.js';
import { isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IDirectDataOperation } from './ports/IDirectDataOperation.js';

/**
 * Dependências injetáveis do DirectDataExecutor.
 * Facilita testes e substituição de operações individuais.
 *
 * @interface DirectDataExecutorDeps
 */
export interface DirectDataExecutorDeps {
  cadastroPessoaFisica: IDirectDataOperation<unknown>;
  cadastroPessoaJuridica: IDirectDataOperation<unknown>;
  processosJudiciaisCompleta: IDirectDataOperation<unknown>;
}

/**
 * Executor de consultas DirectData.
 * Implementa `ISourceExecutor` para padronizar integração com o motor de consultas.
 *
 * Fluxos suportados:
 * - CPF     → CadastroPessoaFisica (dados cadastrais PF)
 * - CNPJ    → CadastroPessoaJuridica (dados cadastrais PJ)
 * - PROCESSO → ProcessosJudiciaisCompleta (processo por número CNJ)
 *
 * @class DirectDataExecutor
 * @implements {ISourceExecutor}
 */
export class DirectDataExecutor implements ISourceExecutor {
  readonly sourceName = 'directdata';

  constructor(private readonly deps: DirectDataExecutorDeps) {}

  /**
   * Executa consulta no DirectData baseado no tipo de identificador.
   *
   * @param {SourceContext} context - Contexto com identifier, identifierKind, timeoutMs, etc.
   * @returns {Promise<Either<SourceError, SourceResult>>} Resultado ou erro tipado
   */
  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    const start = Date.now();

    const result = await this.dispatch(context);
    if (isLeft(result)) return result;

    const { metaDados, retorno } = result.value as {
      metaDados: Record<string, unknown>;
      retorno: unknown;
    };

    return right({
      source: this.sourceName,
      data: {
        metaDados,
        retorno: retorno ?? null,
      },
      cost: 1,
      latency_ms: Date.now() - start,
    });
  }

  /**
   * Despacha para a operação correta baseado no tipo de identificador.
   *
   * @private
   */
  private dispatch(context: SourceContext): Promise<Either<SourceError, unknown>> {
    switch (context.identifierKind) {
      case 'CPF':
        return this.deps.cadastroPessoaFisica.execute({ CPF: context.identifier });

      case 'CNPJ':
        return this.deps.cadastroPessoaJuridica.execute({ CNPJ: context.identifier });

      case 'PROCESSO':
        return this.deps.processosJudiciaisCompleta.execute({ PROCESSO: context.identifier });

      default: {
        const exhaustive: never = context.identifierKind;
        return Promise.resolve(
          left(
            new SourceError(
              'UPSTREAM_ERROR',
              this.sourceName,
              `Tipo de identificador não suportado: ${String(exhaustive)}`,
            ),
          ),
        );
      }
    }
  }
}
