/**
 * @fileoverview Port para operation LeilaoConjugado.
 * @module infrastructure/providers/apibrasil/ports/ILeilaoConjugado
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { LeilaoConjugadoDto } from '../dtos/LeilaoConjugadoDto.js';

export interface ILeilaoConjugado {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LeilaoConjugadoDto>>;
}
