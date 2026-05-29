/**
 * @fileoverview Port para operation AgregadosChassi.
 * @module infrastructure/providers/apibrasil/ports/IAgregadosChassi
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AgregadosChassiDto } from '../dtos/AgregadosChassiDto.js';

export interface IAgregadosChassi {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AgregadosChassiDto>>;
}
