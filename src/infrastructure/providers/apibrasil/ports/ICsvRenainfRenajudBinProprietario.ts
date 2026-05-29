/**
 * @fileoverview Port para operation CsvRenainfRenajudBinProprietario.
 * @module infrastructure/providers/apibrasil/ports/ICsvRenainfRenajudBinProprietario
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CsvRenainfRenajudBinProprietarioDto } from '../dtos/CsvRenainfRenajudBinProprietarioDto.js';

export interface ICsvRenainfRenajudBinProprietario {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CsvRenainfRenajudBinProprietarioDto>>;
}
