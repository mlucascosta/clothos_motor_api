/**
 * @fileoverview Port para operation AnaliseCreditoPlusPf.
 * @module infrastructure/providers/apibrasil/ports/IAnaliseCreditoPlusPf
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

export interface IAnaliseCreditoPlusPf {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
