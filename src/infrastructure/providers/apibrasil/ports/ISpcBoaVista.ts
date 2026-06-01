/**
 * @fileoverview Port para operation SpcBoaVista.
 * @module infrastructure/providers/apibrasil/ports/ISpcBoaVista
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SpcBoaVistaDto } from '../dtos/SpcBoaVistaDto.js';

export interface ISpcBoaVista {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, SpcBoaVistaDto>>;
}
