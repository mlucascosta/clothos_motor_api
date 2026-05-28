/**
 * @fileoverview Port para operation NivelSocioeconomicoCrypt.
 * @module infrastructure/providers/directdata/ports/INivelSocioeconomicoCrypt
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { NivelSocioeconomicoCryptRetornoDto } from '../dtos/NivelSocioeconomicoCryptDto.js';

/**
 * Interface para consulta de NivelSocioeconomico/Crypt.
 *
 * @interface INivelSocioeconomicoCrypt
 */
export interface INivelSocioeconomicoCrypt {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: NivelSocioeconomicoCryptRetornoDto | null;
  }>>;
}
