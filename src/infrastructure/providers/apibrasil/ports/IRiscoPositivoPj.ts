/**
 * @fileoverview Port para operation RiscoPositivoPj.
 * @module infrastructure/providers/apibrasil/ports/IRiscoPositivoPj
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface IRiscoPositivoPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
