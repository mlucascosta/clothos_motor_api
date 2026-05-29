/**
 * @fileoverview Port para operation SintegraCadastrosEstaduais.
 * @module infrastructure/providers/apibrasil/ports/ISintegraCadastrosEstaduais
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SintegraCadastrosEstaduaisDto } from '../dtos/SintegraCadastrosEstaduaisDto.js';

export interface ISintegraCadastrosEstaduais {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SintegraCadastrosEstaduaisDto>>;
}
