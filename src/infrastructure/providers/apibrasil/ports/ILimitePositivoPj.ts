/**
 * @fileoverview Port para operation LimitePositivoPj.
 * @module infrastructure/providers/apibrasil/ports/ILimitePositivoPj
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { LimitePositivoPjDto } from '../dtos/LimitePositivoPjDto.js';

export interface ILimitePositivoPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LimitePositivoPjDto>>;
}
