/**
 * @fileoverview Port para operation CreditosSimplesPj.
 * @module infrastructure/providers/apibrasil/ports/ICreditosSimplesPj
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface ICreditosSimplesPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
