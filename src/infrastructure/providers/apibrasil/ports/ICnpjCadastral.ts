/**
 * @fileoverview Port para operation CnpjCadastral.
 * @module infrastructure/providers/apibrasil/ports/ICnpjCadastral
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface ICnpjCadastral {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>>;
}
