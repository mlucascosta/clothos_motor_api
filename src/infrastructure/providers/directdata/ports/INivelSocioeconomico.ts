/**
 * @fileoverview Port para operation NivelSocioeconomico.
 * @module infrastructure/providers/directdata/ports/INivelSocioeconomico
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { NivelSocioeconomicoRetornoDto } from '../dtos/NivelSocioeconomicoDto.js';

/**
 * Interface para consulta de NivelSocioeconomico.
 *
 * @interface INivelSocioeconomico
 */
export interface INivelSocioeconomico {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: NivelSocioeconomicoRetornoDto | null;
  }>>;
}
