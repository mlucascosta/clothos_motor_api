/**
 * @fileoverview Port para operation BaseEstadualV3.
 * @module infrastructure/providers/apibrasil/ports/IBaseEstadualV3
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface IBaseEstadualV3 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
