/**
 * @fileoverview Executor de consultas ao provedor DataJud (CNJ).
 * Implementa ISourceExecutor para busca automática de processos por número CNJ.
 * @module infrastructure/providers/datajud/DataJudExecutor
 */

import { left, right, type Either } from '../../../shared/domain/Either.js';
import { SourceError } from '../../../shared/domain/errors/SourceError.js';
import type { ISourceExecutor, SourceContext, SourceResult } from '../../../application/queries/ports/ISourceExecutor.js';
import { extrairSiglaDoCNJ } from './CNJHelper.js';
import type { IBuscarProcessoPorNumero } from './operations/IBuscarProcessoPorNumero.js';

/**
 * Executor de consultas DataJud.
 * Determina automaticamente o tribunal pelo dígito do CNJ e delega a busca.
 *
 * @class DataJudExecutor
 * @implements {ISourceExecutor}
 */
export class DataJudExecutor implements ISourceExecutor {
  readonly sourceName = 'datajud';

  constructor(private readonly buscarPorNumero: IBuscarProcessoPorNumero) {}

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

    if (result._tag === 'Left') return result;

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
