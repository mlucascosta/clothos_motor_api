/**
 * @fileoverview Executor de consultas ao provedor DataJud (CNJ).
 * Implementa ISourceExecutor para busca automática de processos por número CNJ.
 * @module infrastructure/providers/datajud/DataJudExecutor
 */

import { isLeft, left, right, type Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ISourceExecutor, SourceContext, SourceResult } from '@application/queries/ports/ISourceExecutor.js';
import { extrairSiglaDoCNJ } from './CNJHelper.js';
import type { IBuscarProcessoPorNumero } from './operations/IBuscarProcessoPorNumero.js';

/**
 * Executor de consultas DataJud.
 * Determina automaticamente o tribunal pelo dígito do CNJ e delega a busca.
 *
 * **Restrições:**
 * - Aceita apenas `identifierKind === 'PROCESSO'` (número CNJ formatado)
 * - Rejeita CPF e CNPJ com `UPSTREAM_ERROR`
 * - Custo fixo: 1 crédito por consulta (independente do número de resultados)
 *
 * @class DataJudExecutor
 * @implements {ISourceExecutor}
 *
 * @example
 * ```typescript
 * const executor = new DataJudExecutor(new BuscarProcessoPorNumero(http));
 * const result = await executor.execute({
 *   identifier: '0000001-12.2023.8.26.0001',
 *   identifierKind: 'PROCESSO',
 *   tenantId: 'acme',
 * });
 * ```
 */
export class DataJudExecutor implements ISourceExecutor {
  /** Nome canônico do provider — usado em logs e persistência de auditoria */
  readonly sourceName = 'datajud';

  /**
   * Constrói o executor DataJud com a operação de busca injetada.
   *
   * @param {IBuscarProcessoPorNumero} buscarPorNumero - Operação que executa a busca no tribunal correto
   */
  constructor(private readonly buscarPorNumero: IBuscarProcessoPorNumero) {}

  /**
   * Executa consulta de processo judicial no DataJud.
   *
   * **Pipeline:**
   * 1. Valida que `identifierKind === 'PROCESSO'` — rejeita CPF/CNPJ
   * 2. Extrai sigla do tribunal a partir do número CNJ via `extrairSiglaDoCNJ()`
   * 3. Delega busca para `IBuscarProcessoPorNumero.execute()`
   * 4. Mapeia hits do Elasticsearch para `SourceResult.data`
   *
   * @param {SourceContext} context - Contexto da consulta com `identifier` (número CNJ) e `identifierKind`
   * @returns {Promise<Either<SourceError, SourceResult>>} Resultado com lista de processos ou erro tipado
   */
  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    const start = Date.now();

    if (context.identifierKind !== 'PROCESSO') {
      return left(
        new SourceError(
          'UPSTREAM_ERROR',
          this.sourceName,
          `DataJud suporta apenas identifierKind='PROCESSO', recebido '${context.identifierKind}'`,
        ),
      );
    }

    const sigla = extrairSiglaDoCNJ(context.identifier);
    if (!sigla) {
      return left(
        new SourceError('SCHEMA_MISMATCH', this.sourceName, `Número CNJ inválido: ${context.identifier}`),
      );
    }

    const result = await this.buscarPorNumero.execute({
      sigla,
      numeroProcesso: context.identifier,
    });

    if (isLeft(result)) return result;

    return right({
      source: this.sourceName,
      data: {
        numeroProcesso: context.identifier,
        tribunal: sigla,
        totalHits: result.value.hits.total.value,
        processos: result.value.hits.hits.map((h) => h._source),
      },
      cost: 1,
      latency_ms: Date.now() - start,
    });
  }
}
