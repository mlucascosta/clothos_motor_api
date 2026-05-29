/**
 * @fileoverview Port para operation ReceitaFederalPf.
 * @module infrastructure/providers/apibrasil/ports/IReceitaFederalPf
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ReceitaFederalPfDto } from '../dtos/ReceitaFederalPfDto.js';

export interface IReceitaFederalPf {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ReceitaFederalPfDto>>;
}
