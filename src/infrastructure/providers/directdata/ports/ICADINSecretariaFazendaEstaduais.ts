/**
 * @fileoverview Port para operation CADINSecretariaFazendaEstaduais.
 * @module infrastructure/providers/directdata/ports/ICADINSecretariaFazendaEstaduais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CADINSecretariaFazendaEstaduaisRetornoDto } from '../dtos/CADINSecretariaFazendaEstaduaisDto.js';

/**
 * Interface para consulta de CADINSecretariaFazendaEstaduais.
 *
 * @interface ICADINSecretariaFazendaEstaduais
 */
export interface ICADINSecretariaFazendaEstaduais {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CADINSecretariaFazendaEstaduaisRetornoDto | null;
  }>>;
}
