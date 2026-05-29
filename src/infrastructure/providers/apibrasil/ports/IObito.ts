/**
 * @fileoverview Port para operation Obito.
 * @module infrastructure/providers/apibrasil/ports/IObito
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ObitoDto } from '../dtos/ObitoDto.js';

export interface IObito {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ObitoDto>>;
}
