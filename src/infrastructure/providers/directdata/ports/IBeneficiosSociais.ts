/**
 * @fileoverview Port para operation BeneficiosSociais.
 * @module infrastructure/providers/directdata/ports/IBeneficiosSociais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { BeneficiosSociaisRetornoDto } from '../dtos/BeneficiosSociaisDto.js';

/**
 * Interface para consulta de BeneficiosSociais.
 *
 * @interface IBeneficiosSociais
 */
export interface IBeneficiosSociais {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: BeneficiosSociaisRetornoDto | null;
  }>>;
}
