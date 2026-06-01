/**
 * @fileoverview Port para operation CpfDados.
 * @module infrastructure/providers/apibrasil/ports/ICpfDados
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CpfDadosDto } from '../dtos/CpfDadosDto.js';

export interface ICpfDados {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, CpfDadosDto>>;
}
