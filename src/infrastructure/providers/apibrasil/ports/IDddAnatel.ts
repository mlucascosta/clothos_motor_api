/**
 * @fileoverview Port para operation DddAnatel.
 * @module infrastructure/providers/apibrasil/ports/IDddAnatel
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface IDddAnatel {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
