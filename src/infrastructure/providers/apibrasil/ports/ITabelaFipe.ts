/**
 * @fileoverview Port para operation TabelaFipe.
 * @module infrastructure/providers/apibrasil/ports/ITabelaFipe
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { TabelaFipeDto } from '../dtos/TabelaFipeDto.js';

export interface ITabelaFipe {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, TabelaFipeDto>>;
}
