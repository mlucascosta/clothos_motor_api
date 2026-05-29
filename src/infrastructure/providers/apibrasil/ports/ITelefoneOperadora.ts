/**
 * @fileoverview Port para operation TelefoneOperadora.
 * @module infrastructure/providers/apibrasil/ports/ITelefoneOperadora
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { TelefoneOperadoraDto } from '../dtos/TelefoneOperadoraDto.js';

export interface ITelefoneOperadora {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, TelefoneOperadoraDto>>;
}
