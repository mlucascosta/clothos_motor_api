/**
 * @fileoverview Port para operation DecodificadorPrecificador.
 * @module infrastructure/providers/apibrasil/ports/IDecodificadorPrecificador
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DecodificadorPrecificadorDto } from '../dtos/DecodificadorPrecificadorDto.js';

export interface IDecodificadorPrecificador {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, DecodificadorPrecificadorDto>>;
}
