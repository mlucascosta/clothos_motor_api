/**
 * @fileoverview Port para operation AntecedentesCriminais.
 * @module infrastructure/providers/apibrasil/ports/IAntecedentesCriminais
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AntecedentesCriminaisDto } from '../dtos/AntecedentesCriminaisDto.js';

export interface IAntecedentesCriminais {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AntecedentesCriminaisDto>>;
}
