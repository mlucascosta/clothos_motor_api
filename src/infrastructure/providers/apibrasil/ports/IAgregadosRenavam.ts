/**
 * @fileoverview Port para operation AgregadosRenavam.
 * @module infrastructure/providers/apibrasil/ports/IAgregadosRenavam
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AgregadosRenavamDto } from '../dtos/AgregadosRenavamDto.js';

export interface IAgregadosRenavam {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AgregadosRenavamDto>>;
}
