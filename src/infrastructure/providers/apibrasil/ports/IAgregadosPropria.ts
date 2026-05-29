/**
 * @fileoverview Port para operation AgregadosPropria.
 * @module infrastructure/providers/apibrasil/ports/IAgregadosPropria
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AgregadosPropriaDto } from '../dtos/AgregadosPropriaDto.js';

export interface IAgregadosPropria {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AgregadosPropriaDto>>;
}
