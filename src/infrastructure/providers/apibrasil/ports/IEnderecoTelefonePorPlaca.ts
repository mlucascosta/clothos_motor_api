/**
 * @fileoverview Port para operation EnderecoTelefonePorPlaca.
 * @module infrastructure/providers/apibrasil/ports/IEnderecoTelefonePorPlaca
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { EnderecoTelefonePorPlacaDto } from '../dtos/EnderecoTelefonePorPlacaDto.js';

export interface IEnderecoTelefonePorPlaca {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, EnderecoTelefonePorPlacaDto>>;
}
