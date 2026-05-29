/**
 * @fileoverview Port para operation TransacionalPj.
 * @module infrastructure/providers/apibrasil/ports/ITransacionalPj
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { TransacionalPjDto } from '../dtos/TransacionalPjDto.js';

export interface ITransacionalPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, TransacionalPjDto>>;
}
