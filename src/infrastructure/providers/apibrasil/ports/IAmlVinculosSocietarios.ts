/**
 * @fileoverview Port para operation AmlVinculosSocietarios.
 * @module infrastructure/providers/apibrasil/ports/IAmlVinculosSocietarios
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface IAmlVinculosSocietarios {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
