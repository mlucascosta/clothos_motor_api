/**
 * @fileoverview Port para operation Leilao.
 * @module infrastructure/providers/apibrasil/ports/ILeilao
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { LeilaoDto } from '../dtos/LeilaoDto.js';

export interface ILeilao {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LeilaoDto>>;
}
