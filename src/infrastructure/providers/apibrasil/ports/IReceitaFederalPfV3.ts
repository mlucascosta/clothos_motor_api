/**
 * @fileoverview Port para operation ReceitaFederalPfV3.
 * @module infrastructure/providers/apibrasil/ports/IReceitaFederalPfV3
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ReceitaFederalPfV3Dto } from '../dtos/ReceitaFederalPfV3Dto.js';

export interface IReceitaFederalPfV3 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ReceitaFederalPfV3Dto>>;
}
