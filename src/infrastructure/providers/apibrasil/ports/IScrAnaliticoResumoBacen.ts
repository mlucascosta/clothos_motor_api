/**
 * @fileoverview Port para operation ScrAnaliticoResumoBacen.
 * @module infrastructure/providers/apibrasil/ports/IScrAnaliticoResumoBacen
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ScrAnaliticoResumoBacenDto } from '../dtos/ScrAnaliticoResumoBacenDto.js';

export interface IScrAnaliticoResumoBacen {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ScrAnaliticoResumoBacenDto>>;
}
