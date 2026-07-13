import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IInfosimplesOperation } from './ports/IInfosimplesOperation.js';

export class InfosimplesExecutor implements ISourceExecutor {
  readonly sourceName = 'infosimples';

  constructor(private readonly cadastroPessoaJuridica: IInfosimplesOperation) {}

  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    if (context.identifierKind !== 'CNPJ') {
      return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'CNPJ identifier required'));
    }

    const startedAt = Date.now();
    const result = await this.cadastroPessoaJuridica.execute({ cnpj: context.identifier });
    if (isLeft(result)) return result;

    return right({
      source: this.sourceName,
      data: { cnpj: result.value as Record<string, unknown> },
      cost: 1,
      latency_ms: Date.now() - startedAt,
    });
  }
}
