/**
 * @fileoverview Port para operation Estadual.
 * @module infrastructure/providers/apibrasil/ports/IEstadual
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { EstadualDto } from '../dtos/EstadualDto.js';

export interface IEstadual {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, EstadualDto>>;
}
