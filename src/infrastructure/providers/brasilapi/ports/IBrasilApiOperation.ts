import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

export interface IBrasilApiOperation {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>>;
}
