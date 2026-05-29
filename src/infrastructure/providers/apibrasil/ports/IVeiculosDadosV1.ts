/**
 * @fileoverview Port para operation VeiculosDadosV1.
 * @module infrastructure/providers/apibrasil/ports/IVeiculosDadosV1
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

export interface IVeiculosDadosV1 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
