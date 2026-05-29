/**
 * @fileoverview Port para operation ReceitaFederalPjV3.
 * @module infrastructure/providers/apibrasil/ports/IReceitaFederalPjV3
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ReceitaFederalPjV3Dto } from '../dtos/ReceitaFederalPjV3Dto.js';

export interface IReceitaFederalPjV3 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ReceitaFederalPjV3Dto>>;
}
