/**
 * @fileoverview Port para operation AgregadosRenavamV2.
 * @module infrastructure/providers/apibrasil/ports/IAgregadosRenavamV2
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface IAgregadosRenavamV2 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
