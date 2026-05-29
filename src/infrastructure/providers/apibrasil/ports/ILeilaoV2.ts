/**
 * @fileoverview Port para operation LeilaoV2.
 * @module infrastructure/providers/apibrasil/ports/ILeilaoV2
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

export interface ILeilaoV2 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
