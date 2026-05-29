/**
 * @fileoverview Port para operation VeiculosDocumentoPf.
 * @module infrastructure/providers/apibrasil/ports/IVeiculosDocumentoPf
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { VeiculosDocumentoPfDto } from '../dtos/VeiculosDocumentoPfDto.js';

export interface IVeiculosDocumentoPf {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, VeiculosDocumentoPfDto>>;
}
