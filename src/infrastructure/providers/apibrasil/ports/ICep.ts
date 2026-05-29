/**
 * @fileoverview Port para operation Cep.
 * @module infrastructure/providers/apibrasil/ports/ICep
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CepDto } from '../dtos/CepDto.js';

export interface ICep {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CepDto>>;
}
