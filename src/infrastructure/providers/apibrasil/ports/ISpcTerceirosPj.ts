/**
 * @fileoverview Port para operation SpcTerceirosPj.
 * @module infrastructure/providers/apibrasil/ports/ISpcTerceirosPj
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SpcTerceirosPjDto } from '../dtos/SpcTerceirosPjDto.js';

export interface ISpcTerceirosPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SpcTerceirosPjDto>>;
}
