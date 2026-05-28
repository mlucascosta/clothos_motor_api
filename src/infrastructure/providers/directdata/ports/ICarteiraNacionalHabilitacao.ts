/**
 * @fileoverview Port para operation CarteiraNacionalHabilitacao.
 * @module infrastructure/providers/directdata/ports/ICarteiraNacionalHabilitacao
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CarteiraNacionalHabilitacaoRetornoDto } from '../dtos/CarteiraNacionalHabilitacaoDto.js';

/**
 * Interface para consulta de CarteiraNacionalHabilitacao.
 *
 * @interface ICarteiraNacionalHabilitacao
 */
export interface ICarteiraNacionalHabilitacao {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CarteiraNacionalHabilitacaoRetornoDto | null;
  }>>;
}
