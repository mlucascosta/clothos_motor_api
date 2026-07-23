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

      case 'PLACA':
      case 'CHASSI':
        // Veicular (P8): DirectData não tem operação — NÃO suporta, falha fechado (explícito).
        return Promise.resolve(
          left(
            new SourceError(
              'UPSTREAM_ERROR',
              this.sourceName,
              `Tipo de identificador não suportado: ${context.identifierKind}`,
            ),
          ),
        );

      default:
        // RB-21: exhaustiveness check. Todo `identifierKind` do contrato compartilhado precisa ser
        // tratado acima (suporta OU não suporta, explicitamente). Adicionar um novo kind ao union
        // `SourceContext['identifierKind']` sem tratá-lo aqui QUEBRA O BUILD (o parâmetro deixa de
        // ser `never`) — nunca mais um kind novo cai num erro genérico de runtime.
        return this.unsupportedIdentifierKind(context.identifierKind);
    }
  }

  /**
   * Guarda de exaustividade (RB-21). Só é chamável quando `kind` é `never` — ou seja, quando todos
   * os membros do union foram cobertos pelos `case` acima. Se o TypeScript reclamar aqui, é porque
   * um novo `identifierKind` foi adicionado ao contrato e este executor precisa declará-lo.
   *
   * @private
   */
  private unsupportedIdentifierKind(kind: never): Promise<Either<SourceError, unknown>> {
    return Promise.resolve(
      left(
        new SourceError(
          'UPSTREAM_ERROR',
          this.sourceName,
          `Tipo de identificador não tratado: ${String(kind)}`,
        ),
      ),
    );
  }
}
