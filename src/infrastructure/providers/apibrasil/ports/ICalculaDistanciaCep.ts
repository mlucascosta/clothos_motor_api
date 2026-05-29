/**
 * @fileoverview Port para operation CalculaDistanciaCep.
 * @module infrastructure/providers/apibrasil/ports/ICalculaDistanciaCep
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CalculaDistanciaCepDto } from '../dtos/CalculaDistanciaCepDto.js';

export interface ICalculaDistanciaCep {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CalculaDistanciaCepDto>>;
}
