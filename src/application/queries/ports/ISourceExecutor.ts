import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';

export interface SourceContext {
  identifier: string;
  identifierKind: 'CPF' | 'CNPJ';
  tenantSlug: string;
  correlationId: string;
  timeoutMs: number;
}

export interface SourceResult {
  source: string;
  data: Record<string, unknown>;
  cost: number;
  latency_ms: number;
}

export interface ISourceExecutor {
  readonly sourceName: string;
  execute(context: SourceContext): Promise<Either<SourceError, SourceResult>>;
}
