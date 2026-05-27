/**
 * @fileoverview Executor de consultas ao provedor DataJud (CNJ).
 * Implementa ISourceExecutor para busca automática de processos por número CNJ.
 * @module infrastructure/providers/datajud/DataJudExecutor
 */

import { left, right, type Either } from '../../../shared/domain/Either.js';
import { SourceError } from '../../../shared/domain/errors/SourceError.js';
import type { ISourceExecutor, SourceContext, SourceResult } from '../../../application/queries/ports/ISourceExecutor.js';
import type { IHttpClient } from '../../../shared/infrastructure/IHttpClient.js';
import { extrairSiglaDoCNJ } from './CNJHelper.js';
import { DataJudSearchResponseSchema } from './dtos/DataJudSearchResponseDto.js';
import { getDataJudEndpoint } from './DataJudTribunais.js';

/**
 * Executor de consultas DataJud.
 * Implementa `ISourceExecutor` para busca de processos por número CNJ.
 * Determina automaticamente o tribunal pelo dígito do CNJ.
 *
 * @class DataJudExecutor
 * @implements {ISourceExecutor}
 */
export class DataJudExecutor implements ISourceExecutor {
  /** @type {string} Nome do provedor */
  readonly sourceName = 'datajud';

  /**
   * @param {IHttpClient} http - Cliente HTTP ao DataJud
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa busca de processo por número CNJ.
   * Extrai o tribunal do CNJ e busca no endpoint correto.
   *
   * @async
   * @param {SourceContext} context - Contexto com número CNJ como identifier
   * @returns {Promise<Either<SourceError, SourceResult>>}
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

    const endpoint = getDataJudEndpoint(sigla);
    if (!endpoint) {
      return left(new SourceError('NOT_FOUND', this.sourceName, `Tribunal '${sigla}' não mapeado`));
    }

    const path = endpoint.replace('https://api-publica.datajud.cnj.jus.br', '');
    const body = {
      query: {
        match: {
          numeroProcesso: context.identifier,
        },
      },
      size: 1,
    };

    const result = await this.http.request<unknown>(path, {
      method: 'POST',
      body,
    });

    if (result._tag === 'Left') return result;

    const parsed = DataJudSearchResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', this.sourceName, parsed.error.message));
    }

    const data: Record<string, unknown> = {
      numeroProcesso: context.identifier,
      tribunal: sigla,
      totalHits: parsed.data.hits.total.value,
      processos: parsed.data.hits.hits.map((h) => h._source),
    };

    return right({
      source: this.sourceName,
      data,
      cost: 1,
      latency_ms: Date.now() - start,
    });
  }
}
