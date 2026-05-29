/**
 * @fileoverview Port para operation LeilaoSintetico.
 * @module infrastructure/providers/apibrasil/ports/ILeilaoSintetico
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { LeilaoSinteticoDto } from '../dtos/LeilaoSinteticoDto.js';

export interface ILeilaoSintetico {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LeilaoSinteticoDto>>;
}
