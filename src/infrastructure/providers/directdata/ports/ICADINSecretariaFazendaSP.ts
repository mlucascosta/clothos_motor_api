/**
 * @fileoverview Port para operation CADINSecretariaFazendaSP.
 * @module infrastructure/providers/directdata/ports/ICADINSecretariaFazendaSP
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CADINSecretariaFazendaSPRetornoDto } from '../dtos/CADINSecretariaFazendaSPDto.js';

/**
 * Interface para consulta de CADINSecretariaFazendaSP.
 *
 * @interface ICADINSecretariaFazendaSP
 */
export interface ICADINSecretariaFazendaSP {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CADINSecretariaFazendaSPRetornoDto | null;
  }>>;
}
