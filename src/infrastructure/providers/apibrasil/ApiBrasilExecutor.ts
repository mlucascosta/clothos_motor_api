import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ICnpj } from './ports/ICnpj.js';

export class ApiBrasilExecutor implements ISourceExecutor {
  readonly sourceName = 'apibrasil';

  constructor(private readonly cnpj: ICnpj) {}

  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    if (context.identifierKind !== 'CNPJ') {
      return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'CNPJ identifier required'));
    }

    const startedAt = Date.now();
    const result = await this.cnpj.execute({ cnpj: context.identifier });
    if (isLeft(result)) return result;

    return right({
      source: this.sourceName,
      data: { cnpj: result.value },
      cost: 1,
      latency_ms: Date.now() - startedAt,
    });
  }
}
