/**
 * @fileoverview Port para operation BancoCentralInabilitados.
 * @module infrastructure/providers/apibrasil/ports/IBancoCentralInabilitados
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BancoCentralInabilitadosDto } from '../dtos/BancoCentralInabilitadosDto.js';

export interface IBancoCentralInabilitados {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, BancoCentralInabilitadosDto>>;
}
